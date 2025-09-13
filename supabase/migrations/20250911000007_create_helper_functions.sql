-- Create helper functions for common operations

-- Function to get session by code (for student check-in)
CREATE OR REPLACE FUNCTION get_session_by_code(code TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    course_name TEXT,
    topic TEXT,
    status session_status,
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    si_leader_name TEXT,
    current_checkins BIGINT,
    max_capacity INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.course_name,
        s.topic,
        s.status,
        s.scheduled_start,
        s.actual_start,
        p.full_name as si_leader_name,
        COALESCE(checkin_count.count, 0) as current_checkins,
        s.max_capacity
    FROM sessions s
    LEFT JOIN profiles p ON p.id = s.si_leader_id
    LEFT JOIN (
        SELECT session_id, COUNT(*) as count
        FROM session_checkins
        GROUP BY session_id
    ) checkin_count ON checkin_count.session_id = s.id
    WHERE s.session_code = UPPER(code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if student can check in
CREATE OR REPLACE FUNCTION can_student_checkin(
    session_uuid UUID,
    student_name_input TEXT
)
RETURNS TABLE (
    can_checkin BOOLEAN,
    reason TEXT,
    session_info JSONB
) AS $$
DECLARE
    session_record RECORD;
    existing_checkin_count INTEGER;
    current_capacity INTEGER;
BEGIN
    -- Get session info
    SELECT s.*, p.full_name as si_leader_name
    INTO session_record
    FROM sessions s
    LEFT JOIN profiles p ON p.id = s.si_leader_id
    WHERE s.id = session_uuid;
    
    -- Check if session exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found', NULL::JSONB;
        RETURN;
    END IF;
    
    -- Check if session is active
    IF session_record.status != 'active' THEN
        RETURN QUERY SELECT FALSE, 'Session is not currently active for check-ins', 
            jsonb_build_object(
                'session_id', session_record.id,
                'title', session_record.title,
                'status', session_record.status
            );
        RETURN;
    END IF;
    
    -- Check if student already checked in
    SELECT COUNT(*) INTO existing_checkin_count
    FROM session_checkins
    WHERE session_id = session_uuid 
    AND LOWER(student_name) = LOWER(student_name_input);
    
    IF existing_checkin_count > 0 THEN
        RETURN QUERY SELECT FALSE, 'You are already checked in to this session',
            jsonb_build_object(
                'session_id', session_record.id,
                'title', session_record.title,
                'already_checked_in', TRUE
            );
        RETURN;
    END IF;
    
    -- Check capacity if set
    IF session_record.max_capacity IS NOT NULL THEN
        SELECT COUNT(*) INTO current_capacity
        FROM session_checkins
        WHERE session_id = session_uuid;
        
        IF current_capacity >= session_record.max_capacity THEN
            RETURN QUERY SELECT FALSE, 'Session is at full capacity',
                jsonb_build_object(
                    'session_id', session_record.id,
                    'title', session_record.title,
                    'at_capacity', TRUE,
                    'current_capacity', current_capacity,
                    'max_capacity', session_record.max_capacity
                );
            RETURN;
        END IF;
    END IF;
    
    -- All checks passed
    RETURN QUERY SELECT TRUE, 'Can check in',
        jsonb_build_object(
            'session_id', session_record.id,
            'title', session_record.title,
            'course_name', session_record.course_name,
            'topic', session_record.topic,
            'si_leader_name', session_record.si_leader_name
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start a session
CREATE OR REPLACE FUNCTION start_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    session_owner UUID;
BEGIN
    -- Check if user owns this session or is coordinator
    SELECT si_leader_id INTO session_owner
    FROM sessions
    WHERE id = session_uuid;
    
    IF session_owner != auth.uid() AND NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'coordinator'
    ) THEN
        RAISE EXCEPTION 'Unauthorized to start this session';
    END IF;
    
    -- Update session status and actual start time
    UPDATE sessions
    SET 
        status = 'active',
        actual_start = NOW(),
        updated_at = NOW()
    WHERE id = session_uuid
    AND status = 'scheduled';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end a session
CREATE OR REPLACE FUNCTION end_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    session_owner UUID;
BEGIN
    -- Check if user owns this session or is coordinator
    SELECT si_leader_id INTO session_owner
    FROM sessions
    WHERE id = session_uuid;
    
    IF session_owner != auth.uid() AND NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'coordinator'
    ) THEN
        RAISE EXCEPTION 'Unauthorized to end this session';
    END IF;
    
    -- Update session status and actual end time
    UPDATE sessions
    SET 
        status = 'completed',
        actual_end = NOW(),
        updated_at = NOW()
    WHERE id = session_uuid
    AND status = 'active';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get session summary
CREATE OR REPLACE FUNCTION get_session_summary(session_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'session_info', jsonb_build_object(
            'id', s.id,
            'title', s.title,
            'course_name', s.course_name,
            'topic', s.topic,
            'status', s.status,
            'scheduled_start', s.scheduled_start,
            'actual_start', s.actual_start,
            'actual_end', s.actual_end,
            'si_leader', jsonb_build_object(
                'id', p.id,
                'name', p.full_name,
                'email', p.email
            )
        ),
        'attendance', jsonb_build_object(
            'total_checkins', COALESCE(attendance.total_checkins, 0),
            'unique_students', COALESCE(attendance.unique_students, 0),
            'checkins', COALESCE(attendance.checkins, '[]'::jsonb)
        ),
        'confusion_stats', jsonb_build_object(
            'total_feedback', COALESCE(confusion.total_feedback, 0),
            'confused_count', COALESCE(confusion.confused_count, 0),
            'confusion_percentage', COALESCE(confusion.confusion_percentage, 0),
            'timeline', COALESCE(confusion.timeline, '[]'::jsonb)
        ),
        'lessons', COALESCE(lessons.lessons, '[]'::jsonb)
    ) INTO result
    FROM sessions s
    LEFT JOIN profiles p ON p.id = s.si_leader_id
    LEFT JOIN (
        SELECT 
            session_id,
            COUNT(*) as total_checkins,
            COUNT(DISTINCT LOWER(student_name)) as unique_students,
            jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'student_name', student_name,
                    'student_id', student_id,
                    'checked_in_at', checked_in_at
                ) ORDER BY checked_in_at
            ) as checkins
        FROM session_checkins
        WHERE session_id = session_uuid
        GROUP BY session_id
    ) attendance ON attendance.session_id = s.id
    LEFT JOIN (
        SELECT 
            session_id,
            COUNT(*) as total_feedback,
            COUNT(CASE WHEN is_confused THEN 1 END) as confused_count,
            CASE 
                WHEN COUNT(*) > 0 THEN 
                    ROUND((COUNT(CASE WHEN is_confused THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
                ELSE 0
            END as confusion_percentage,
            jsonb_agg(
                jsonb_build_object(
                    'timestamp', timestamp,
                    'is_confused', is_confused,
                    'topic_context', topic_context
                ) ORDER BY timestamp
            ) as timeline
        FROM confusion_feedback
        WHERE session_id = session_uuid
        GROUP BY session_id
    ) confusion ON confusion.session_id = s.id
    LEFT JOIN (
        SELECT 
            session_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'topic', topic,
                    'content', content,
                    'created_at', created_at
                ) ORDER BY created_at
            ) as lessons
        FROM lessons
        WHERE session_id = session_uuid
        GROUP BY session_id
    ) lessons ON lessons.session_id = s.id
    WHERE s.id = session_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;