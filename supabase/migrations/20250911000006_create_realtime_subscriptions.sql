-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE session_checkins;
ALTER PUBLICATION supabase_realtime ADD TABLE confusion_feedback;

-- Create materialized view for session dashboard stats
CREATE MATERIALIZED VIEW session_dashboard_stats AS
SELECT 
    s.id as session_id,
    s.title,
    s.course_name,
    s.topic,
    s.status,
    s.scheduled_start,
    s.actual_start,
    s.actual_end,
    s.si_leader_id,
    p.full_name as si_leader_name,
    COALESCE(checkin_stats.total_checkins, 0) as total_checkins,
    COALESCE(checkin_stats.unique_students, 0) as unique_students,
    COALESCE(confusion_stats.total_feedback, 0) as total_feedback,
    COALESCE(confusion_stats.confused_count, 0) as confused_count,
    COALESCE(confusion_stats.confusion_percentage, 0) as confusion_percentage,
    COALESCE(lesson_stats.lesson_count, 0) as lesson_count
FROM sessions s
LEFT JOIN profiles p ON p.id = s.si_leader_id
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as total_checkins,
        COUNT(DISTINCT LOWER(student_name)) as unique_students
    FROM session_checkins
    GROUP BY session_id
) checkin_stats ON checkin_stats.session_id = s.id
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN is_confused THEN 1 END) as confused_count,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN is_confused THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END as confusion_percentage
    FROM confusion_feedback
    GROUP BY session_id
) confusion_stats ON confusion_stats.session_id = s.id
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as lesson_count
    FROM lessons
    GROUP BY session_id
) lesson_stats ON lesson_stats.session_id = s.id;

-- Create unique index for materialized view refresh
CREATE UNIQUE INDEX idx_session_dashboard_stats_session_id 
ON session_dashboard_stats(session_id);

-- Create function to refresh dashboard stats
CREATE OR REPLACE FUNCTION refresh_session_dashboard_stats()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY session_dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to trigger dashboard refresh on data changes
CREATE OR REPLACE FUNCTION trigger_dashboard_refresh()
RETURNS TRIGGER AS $$
BEGIN
    -- Use pg_notify to signal the application to refresh stats
    PERFORM pg_notify('dashboard_refresh', NEW.session_id::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh dashboard stats
CREATE TRIGGER refresh_dashboard_on_checkin
    AFTER INSERT OR UPDATE OR DELETE ON session_checkins
    FOR EACH ROW EXECUTE FUNCTION trigger_dashboard_refresh();

CREATE TRIGGER refresh_dashboard_on_feedback
    AFTER INSERT OR UPDATE OR DELETE ON confusion_feedback
    FOR EACH ROW EXECUTE FUNCTION trigger_dashboard_refresh();

CREATE TRIGGER refresh_dashboard_on_lesson
    AFTER INSERT OR UPDATE OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION trigger_dashboard_refresh();

CREATE TRIGGER refresh_dashboard_on_session
    AFTER UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION trigger_dashboard_refresh();