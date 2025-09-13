import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Create a typed Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Typed table helpers
export const tables = {
  profiles: () => supabase.from("profiles"),
  sessions: () => supabase.from("sessions"),
  session_checkins: () => supabase.from("session_checkins"),
  confusion_feedback: () => supabase.from("confusion_feedback"),
  lessons: () => supabase.from("lessons"),
} as const;

// Example usage with full type safety:
/*
// ✅ Fully typed - TypeScript knows the exact shape
const { data: sessions, error } = await tables.sessions()
  .select(`
    *,
    si_leader:profiles(*)
  `)
  .eq('status', 'active')

// ✅ TypeScript knows this is SessionInsert type
const newSession: SessionInsert = {
  title: 'Math Study Session',
  course_name: 'MATH 101',
  topic: 'Calculus',
  si_leader_id: 'user-id',
  scheduled_start: new Date().toISOString()
}

const { data, error } = await tables.sessions()
  .insert(newSession)
  .select()
  .single()
*/
