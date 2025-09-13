-- Insert sample data for development and testing
-- Note: This should only be run in development environments

-- Sample SI Leader profile (you'll need to create this user in Supabase Auth first)
-- INSERT INTO profiles (id, email, full_name, role) VALUES 
-- ('00000000-0000-0000-0000-000000000001', 'si.leader@example.com', 'John Smith', 'si_leader')
-- ON CONFLICT (id) DO NOTHING;

-- Sample Coordinator profile
-- INSERT INTO profiles (id, email, full_name, role) VALUES 
-- ('00000000-0000-0000-0000-000000000002', 'coordinator@example.com', 'Jane Doe', 'coordinator')
-- ON CONFLICT (id) DO NOTHING;

-- Sample sessions (uncomment and modify IDs as needed)
-- INSERT INTO sessions (id, title, description, course_name, topic, si_leader_id, session_code, scheduled_start) VALUES 
-- (
--     '10000000-0000-0000-0000-000000000001',
--     'Calculus Study Session',
--     'Review of derivatives and integrals',
--     'MATH 101',
--     'Derivatives and Integrals',
--     '00000000-0000-0000-0000-000000000001',
--     'CALC01',
--     NOW() + INTERVAL '1 hour'
-- ),
-- (
--     '10000000-0000-0000-0000-000000000002',
--     'Physics Problem Solving',
--     'Working through mechanics problems',
--     'PHYS 201',
--     'Mechanics',
--     '00000000-0000-0000-0000-000000000001',
--     'PHYS01',
--     NOW() + INTERVAL '2 hours'
-- )
-- ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance on commonly searched fields
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON profiles(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_sessions_course_topic ON sessions(course_name, topic);
CREATE INDEX IF NOT EXISTS idx_session_checkins_name_lower ON session_checkins(LOWER(student_name));

-- Create function to clean up old data (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_data(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete old completed sessions and related data
    WITH deleted_sessions AS (
        DELETE FROM sessions 
        WHERE status = 'completed' 
        AND actual_end < NOW() - INTERVAL '1 day' * days_old
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted_sessions;
    
    -- The related data (checkins, feedback, lessons) will be deleted automatically
    -- due to CASCADE foreign key constraints
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'total_profiles', (SELECT COUNT(*) FROM profiles),
        'si_leaders', (SELECT COUNT(*) FROM profiles WHERE role = 'si_leader'),
        'students', (SELECT COUNT(*) FROM profiles WHERE role = 'student'),
        'coordinators', (SELECT COUNT(*) FROM profiles WHERE role = 'coordinator'),
        'total_sessions', (SELECT COUNT(*) FROM sessions),
        'active_sessions', (SELECT COUNT(*) FROM sessions WHERE status = 'active'),
        'scheduled_sessions', (SELECT COUNT(*) FROM sessions WHERE status = 'scheduled'),
        'completed_sessions', (SELECT COUNT(*) FROM sessions WHERE status = 'completed'),
        'total_checkins', (SELECT COUNT(*) FROM session_checkins),
        'total_feedback', (SELECT COUNT(*) FROM confusion_feedback),
        'confused_feedback', (SELECT COUNT(*) FROM confusion_feedback WHERE is_confused = true),
        'total_lessons', (SELECT COUNT(*) FROM lessons),
        'last_updated', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;