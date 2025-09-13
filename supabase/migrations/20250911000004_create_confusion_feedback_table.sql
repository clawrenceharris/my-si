-- Create confusion_feedback table
CREATE TABLE confusion_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_checkin_id UUID REFERENCES session_checkins(id) ON DELETE SET NULL,
    is_confused BOOLEAN NOT NULL,
    topic_context TEXT, -- What topic/section they're confused about
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_confusion_feedback_session_id ON confusion_feedback(session_id);
CREATE INDEX idx_confusion_feedback_timestamp ON confusion_feedback(timestamp);
CREATE INDEX idx_confusion_feedback_is_confused ON confusion_feedback(is_confused);
CREATE INDEX idx_confusion_feedback_student_checkin_id ON confusion_feedback(student_checkin_id);

-- Enable Row Level Security
ALTER TABLE confusion_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SI Leaders can view feedback for their sessions" ON confusion_feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND (s.si_leader_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coordinator'))
        )
    );

CREATE POLICY "Anyone can submit feedback for active sessions" ON confusion_feedback
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND s.status = 'active'
        )
    );

-- Create function to get real-time confusion stats
CREATE OR REPLACE FUNCTION get_confusion_stats(session_uuid UUID, time_window_minutes INTEGER DEFAULT 5)
RETURNS TABLE (
    total_feedback BIGINT,
    confused_count BIGINT,
    confusion_percentage NUMERIC,
    recent_feedback_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_feedback,
        COUNT(CASE WHEN is_confused THEN 1 END)::BIGINT as confused_count,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN is_confused THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as confusion_percentage,
        COUNT(CASE WHEN timestamp >= NOW() - INTERVAL '1 minute' * time_window_minutes THEN 1 END)::BIGINT as recent_feedback_count
    FROM confusion_feedback 
    WHERE session_id = session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get confusion timeline
CREATE OR REPLACE FUNCTION get_confusion_timeline(session_uuid UUID, interval_minutes INTEGER DEFAULT 1)
RETURNS TABLE (
    time_bucket TIMESTAMPTZ,
    confusion_level NUMERIC,
    feedback_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date_trunc('minute', timestamp) + 
        INTERVAL '1 minute' * (EXTRACT(minute FROM timestamp)::INTEGER / interval_minutes * interval_minutes) as time_bucket,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN is_confused THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as confusion_level,
        COUNT(*)::BIGINT as feedback_count
    FROM confusion_feedback 
    WHERE session_id = session_uuid
    GROUP BY time_bucket
    ORDER BY time_bucket;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;