export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_flows: {
        Row: {
          card_slug: string
          created_at: string | null
          id: string
          instruction: string
          interaction_type: string
          step_number: number
        }
        Insert: {
          card_slug: string
          created_at?: string | null
          id?: string
          instruction: string
          interaction_type: string
          step_number: number
        }
        Update: {
          card_slug?: string
          created_at?: string | null
          id?: string
          instruction?: string
          interaction_type?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_flows_card_slug_fkey"
            columns: ["card_slug"]
            isOneToOne: false
            referencedRelation: "strategy_cards"
            referencedColumns: ["slug"]
          },
        ]
      }
      activity_types: {
        Row: {
          description: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          title?: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      confusion_feedback: {
        Row: {
          created_at: string
          id: string
          is_confused: boolean
          session_id: string
          student_checkin_id: string | null
          timestamp: string
          topic_context: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_confused: boolean
          session_id: string
          student_checkin_id?: string | null
          timestamp?: string
          topic_context?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_confused?: boolean
          session_id?: string
          student_checkin_id?: string | null
          timestamp?: string
          topic_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "confusion_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "confusion_feedback_student_checkin_id_fkey"
            columns: ["student_checkin_id"]
            isOneToOne: false
            referencedRelation: "session_checkins"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_cards: {
        Row: {
          card_slug: string
          category: string
          created_at: string | null
          description: string
          id: string
          lesson_id: string
          phase: Database["public"]["Enums"]["lesson_phase"]
          position: number
          steps: string[]
          title: string
          virtualized: boolean | null
        }
        Insert: {
          card_slug?: string
          category: string
          created_at?: string | null
          description?: string
          id?: string
          lesson_id: string
          phase: Database["public"]["Enums"]["lesson_phase"]
          position: number
          steps: string[]
          title: string
          virtualized?: boolean | null
        }
        Update: {
          card_slug?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          lesson_id?: string
          phase?: Database["public"]["Enums"]["lesson_phase"]
          position?: number
          steps?: string[]
          title?: string
          virtualized?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_cards_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          id: string
          mode: string
          topic: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode?: string
          topic: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: string
          topic?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          courses: string[] | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          courses?: string[] | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          courses?: string[] | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_checkins: {
        Row: {
          checked_in_at: string
          created_at: string
          id: string
          session_id: string
          student_id: string | null
          student_name: string
        }
        Insert: {
          checked_in_at?: string
          created_at?: string
          id?: string
          session_id: string
          student_id?: string | null
          student_name: string
        }
        Update: {
          checked_in_at?: string
          created_at?: string
          id?: string
          session_id?: string
          student_id?: string | null
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_checkins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_inputs: {
        Row: {
          assigned_to: string | null
          id: string
          input: string
          session_id: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          id?: string
          input: string
          session_id: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          id?: string
          input?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_inputs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          call_id: string | null
          course_name: string | null
          created_at: string
          description: string | null
          id: string
          leader_id: string | null
          lesson_id: string | null
          scheduled_start: string
          session_code: string | null
          status: Database["public"]["Enums"]["session_status"]
          topic: string | null
          updated_at: string
          virtual: boolean
        }
        Insert: {
          call_id?: string | null
          course_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string | null
          lesson_id?: string | null
          scheduled_start?: string
          session_code?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          topic?: string | null
          updated_at?: string
          virtual?: boolean
        }
        Update: {
          call_id?: string | null
          course_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string | null
          lesson_id?: string | null
          scheduled_start?: string
          session_code?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          topic?: string | null
          updated_at?: string
          virtual?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "sessions_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      strategy_cards: {
        Row: {
          category: string | null
          course_tags: string[]
          created_at: string | null
          description: string
          good_for: string[]
          id: string
          session_size: Database["public"]["Enums"]["session_size"]
          slug: string
          steps: string[]
          title: string
          virtual_friendly: boolean
          virtualized: boolean | null
        }
        Insert: {
          category?: string | null
          course_tags?: string[]
          created_at?: string | null
          description?: string
          good_for?: string[]
          id?: string
          session_size?: Database["public"]["Enums"]["session_size"]
          slug?: string
          steps: string[]
          title: string
          virtual_friendly?: boolean
          virtualized?: boolean | null
        }
        Update: {
          category?: string | null
          course_tags?: string[]
          created_at?: string | null
          description?: string
          good_for?: string[]
          id?: string
          session_size?: Database["public"]["Enums"]["session_size"]
          slug?: string
          steps?: string[]
          title?: string
          virtual_friendly?: boolean
          virtualized?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_student_checkin: {
        Args: { session_uuid: string; student_name_input: string }
        Returns: {
          can_checkin: boolean
          reason: string
          session_info: Json
        }[]
      }
      cleanup_old_data: {
        Args: { days_old?: number }
        Returns: number
      }
      generate_session_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_confusion_stats: {
        Args: { session_uuid: string; time_window_minutes?: number }
        Returns: {
          confused_count: number
          confusion_percentage: number
          recent_feedback_count: number
          total_feedback: number
        }[]
      }
      get_confusion_timeline: {
        Args: { interval_minutes?: number; session_uuid: string }
        Returns: {
          confusion_level: number
          feedback_count: number
          time_bucket: string
        }[]
      }
      get_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_session_by_code: {
        Args: { code: string }
        Returns: {
          actual_start: string
          course_name: string
          current_checkins: number
          id: string
          max_capacity: number
          scheduled_start: string
          si_leader_name: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          topic: string
        }[]
      }
      get_session_checkin_stats: {
        Args: { session_uuid: string }
        Returns: {
          latest_checkin: string
          total_checkins: number
          unique_students: number
        }[]
      }
      get_session_summary: {
        Args: { session_uuid: string }
        Returns: Json
      }
      refresh_session_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      start_session: {
        Args: { session_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      lesson_phase: "warmup" | "workout" | "closer"
      session_size: "1+" | "2+" | "4+" | "2-4" | "4-8" | "8+"
      session_status: "scheduled" | "active" | "completed" | "canceled"
      user_role: "si_leader" | "student" | "coordinator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lesson_phase: ["warmup", "workout", "closer"],
      session_size: ["1+", "2+", "4+", "2-4", "4-8", "8+"],
      session_status: ["scheduled", "active", "completed", "canceled"],
      user_role: ["si_leader", "student", "coordinator"],
    },
  },
} as const
