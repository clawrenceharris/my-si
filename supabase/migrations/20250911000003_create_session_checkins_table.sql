-- Create session_checkins table
CREATE TABLE session_checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_id TEXT, -- Optional student ID/number
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_session_checkins_session_id ON session_checkins(session_id);
CREATE INDEX idx_session_checkins_student_name ON session_checkins(student_name);
CREATE INDEX idx_session_checkins_checked_in_at ON session_checkins(checked_in_at);

-- Create unique constraint to prevent duplicate checkins
CREATE UNIQUE INDEX idx_session_checkins_unique 
ON session_checkins(session_id, LOWER(student_name));

-- Enable Row Level Security
ALTER TABLE session_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SI Leaders can view checkins for their sessions" ON session_checkins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND (s.si_leader_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coordinator'))
        )
    );

CREATE POLICY "Anyone can check in to active sessions" ON session_checkins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND s.status = 'active'
        )
    );

CREATE POLICY "SI Leaders can manage checkins for their sessions" ON session_checkins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND (s.si_leader_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coordinator'))
        )
    );

-- Create function to get session checkin stats
CREATE OR REPLACE FUNCTION get_session_checkin_stats(session_uuid UUID)
RETURNS TABLE (
    total_checkins BIGINT,
    unique_students BIGINT,
    latest_checkin TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_checkins,
        COUNT(DISTINCT LOWER(student_name))::BIGINT as unique_students,
        MAX(checked_in_at) as latest_checkin
    FROM session_checkins 
    WHERE session_id = session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;