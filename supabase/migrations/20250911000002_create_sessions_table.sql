-- Create session status enum
CREATE TYPE session_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');

-- Create sessions table
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    course_name TEXT NOT NULL,
    topic TEXT NOT NULL,
    si_leader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_code TEXT NOT NULL UNIQUE,
    max_capacity INTEGER DEFAULT 50,
    status session_status NOT NULL DEFAULT 'scheduled',
    scheduled_start TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_si_leader_id ON sessions(si_leader_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_scheduled_start ON sessions(scheduled_start);
CREATE INDEX idx_sessions_session_code ON sessions(session_code);
CREATE INDEX idx_sessions_course_name ON sessions(course_name);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SI Leaders can manage their own sessions" ON sessions
    FOR ALL USING (
        si_leader_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('coordinator')
        )
    );

CREATE POLICY "Students can view active sessions" ON sessions
    FOR SELECT USING (
        status IN ('scheduled', 'active') OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('si_leader', 'coordinator')
        )
    );

-- Create function to generate unique session codes
CREATE OR REPLACE FUNCTION generate_session_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate a 6-character alphanumeric code
        code := UPPER(
            SUBSTRING(
                MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) 
                FROM 1 FOR 6
            )
        );
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_check 
        FROM sessions 
        WHERE session_code = code;
        
        -- Exit loop if code is unique
        EXIT WHEN exists_check = 0;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate session codes
CREATE OR REPLACE FUNCTION set_session_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_code IS NULL OR NEW.session_code = '' THEN
        NEW.session_code := generate_session_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_code_trigger
    BEFORE INSERT ON sessions
    FOR EACH ROW EXECUTE FUNCTION set_session_code();

-- Create trigger for updated_at
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();