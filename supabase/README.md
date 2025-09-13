# MySI Database Schema

This directory contains all Supabase migrations for the MySI (Supplemental Instruction) application.

## Overview

The database is designed to support:

- **User Management**: SI Leaders, Students, and Coordinators
- **Session Management**: Creating, managing, and tracking SI sessions
- **Student Check-ins**: Anonymous check-in system with QR codes
- **Real-time Feedback**: Confusion meter for live session feedback
- **AI Lesson Generation**: AI-powered content creation and storage

## Database Schema

### Core Tables

#### `profiles`

Extends Supabase auth.users with application-specific data

- User roles: `si_leader`, `student`, `coordinator`
- Profile information and preferences
- Automatic creation via trigger on user signup

#### `sessions`

SI session management

- Session details (title, course, topic, schedule)
- Unique session codes for student access
- Status tracking (scheduled → active → completed)
- Capacity management

#### `session_checkins`

Student attendance tracking

- Anonymous check-ins (name only, no account required)
- Duplicate prevention per session
- Timestamp tracking for analytics

#### `confusion_feedback`

Real-time confusion tracking

- Anonymous feedback submission
- Timestamped for trend analysis
- Optional topic context

#### `lessons`

AI-generated lesson content

- JSONB content storage for flexibility
- Full-text search capabilities
- Version tracking and authorship

### Key Features

#### Row Level Security (RLS)

All tables have comprehensive RLS policies:

- Users can only access their own data
- SI Leaders can manage their sessions
- Coordinators have administrative access
- Students can access public session data

#### Real-time Subscriptions

Enabled for live updates:

- Session status changes
- New check-ins
- Confusion feedback
- Dashboard statistics

#### Helper Functions

- `get_session_by_code()`: Find sessions by QR code
- `can_student_checkin()`: Validate check-in eligibility
- `start_session()` / `end_session()`: Session lifecycle management
- `get_session_summary()`: Comprehensive session analytics
- `get_confusion_stats()`: Real-time confusion metrics

## Migration Files

1. **`20250911000001_create_profiles_table.sql`**

   - User profiles and roles
   - Auto-creation trigger
   - RLS policies

2. **`20250911000002_create_sessions_table.sql`**

   - Session management
   - Unique code generation
   - Status tracking

3. **`20250911000003_create_session_checkins_table.sql`**

   - Student check-in system
   - Duplicate prevention
   - Analytics functions

4. **`20250911000004_create_confusion_feedback_table.sql`**

   - Real-time feedback system
   - Confusion analytics
   - Timeline functions

5. **`20250911000005_create_lessons_table.sql`**

   - AI lesson storage
   - Content search
   - JSONB indexing

6. **`20250911000006_create_realtime_subscriptions.sql`**

   - Real-time enablement
   - Dashboard materialized views
   - Refresh triggers

7. **`20250911000007_create_helper_functions.sql`**

   - Utility functions
   - Session management
   - Analytics helpers

8. **`20250911000008_create_sample_data.sql`**
   - Development data
   - Performance indexes
   - Maintenance functions

## Setup Instructions

### 1. Initialize Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Run Migrations

```bash
# Apply all migrations
supabase db push

# Or apply migrations individually
supabase migration up
```

### 3. Generate TypeScript Types

```bash
# Generate types for your project
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 4. Enable Real-time (if needed)

In your Supabase dashboard:

1. Go to Database → Replication
2. Enable real-time for tables: `sessions`, `session_checkins`, `confusion_feedback`

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage Examples

### Creating a Session

```sql
INSERT INTO sessions (title, course_name, topic, si_leader_id, scheduled_start)
VALUES ('Calculus Review', 'MATH 101', 'Derivatives', auth.uid(), '2024-01-15 14:00:00');
```

### Student Check-in

```sql
-- Check if student can check in
SELECT * FROM can_student_checkin('session-uuid', 'John Doe');

-- Perform check-in
INSERT INTO session_checkins (session_id, student_name)
VALUES ('session-uuid', 'John Doe');
```

### Submit Confusion Feedback

```sql
INSERT INTO confusion_feedback (session_id, is_confused, topic_context)
VALUES ('session-uuid', true, 'Integration by parts');
```

### Get Session Analytics

```sql
SELECT * FROM get_session_summary('session-uuid');
SELECT * FROM get_confusion_stats('session-uuid');
```

## Security Considerations

1. **RLS Policies**: All tables have comprehensive row-level security
2. **Function Security**: Helper functions use `SECURITY DEFINER` with proper authorization checks
3. **Input Validation**: All user inputs should be validated at the application level
4. **Rate Limiting**: Consider implementing rate limiting for feedback submission
5. **Data Retention**: Use `cleanup_old_data()` function for regular maintenance

## Performance Optimization

1. **Indexes**: Comprehensive indexing on frequently queried columns
2. **Materialized Views**: Dashboard stats are pre-computed for performance
3. **JSONB Indexing**: GIN indexes for AI lesson content search
4. **Query Optimization**: Helper functions use efficient query patterns

## Monitoring

Use the `get_database_stats()` function to monitor:

- User distribution by role
- Session status distribution
- Feedback and engagement metrics
- System health indicators

## Backup and Recovery

1. **Automatic Backups**: Supabase provides automatic daily backups
2. **Point-in-time Recovery**: Available for Pro plans and above
3. **Manual Exports**: Use `pg_dump` for additional backup security
4. **Migration Rollback**: Keep migration rollback scripts for critical changes

## Development vs Production

- **Sample Data**: Migration 8 includes sample data (commented out for production)
- **Cleanup Functions**: Use `cleanup_old_data()` in production for maintenance
- **Monitoring**: Enable logging and monitoring in production environments
- **Performance**: Consider connection pooling and read replicas for high traffic
