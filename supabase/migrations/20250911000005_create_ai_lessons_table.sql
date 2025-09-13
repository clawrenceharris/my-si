-- Create lessons table
CREATE TABLE lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    content JSONB NOT NULL, -- Structured lesson content (exercises, explanations, etc.)
    generated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_lessons_session_id ON lessons(session_id);
CREATE INDEX idx_lessons_generated_by ON lessons(generated_by);
CREATE INDEX idx_lessons_topic ON lessons(topic);
CREATE INDEX idx_lessons_created_at ON lessons(created_at);

-- Create GIN index for JSONB content search
CREATE INDEX idx_lessons_content_gin ON lessons USING GIN (content);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SI Leaders can manage lessons for their sessions" ON lessons
    FOR ALL USING (
        generated_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = session_id 
            AND (s.si_leader_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coordinator'))
        )
    );

CREATE POLICY "Students can view lessons for sessions they've checked into" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM session_checkins sc
            JOIN sessions s ON s.id = sc.session_id
            WHERE sc.session_id = lessons.session_id
            AND s.status IN ('active', 'completed')
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('si_leader', 'coordinator')
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to search lessons by content
CREATE OR REPLACE FUNCTION search_lessons(
    search_term TEXT,
    session_uuid UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    session_id UUID,
    topic TEXT,
    content JSONB,
    generated_by UUID,
    created_at TIMESTAMPTZ,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.session_id,
        l.topic,
        l.content,
        l.generated_by,
        l.created_at,
        ts_rank(
            to_tsvector('english', l.topic || ' ' || l.content::text),
            plainto_tsquery('english', search_term)
        ) as relevance_score
    FROM lessons l
    WHERE 
        (session_uuid IS NULL OR l.session_id = session_uuid)
        AND (
            to_tsvector('english', l.topic || ' ' || l.content::text) @@ 
            plainto_tsquery('english', search_term)
        )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;