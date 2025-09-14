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
      lessons: {
        Row: {
          content: Json
          created_at: string
          generated_by: string
          id: string
          session_id: string
          topic: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          generated_by: string
          id?: string
          session_id: string
          topic: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          generated_by?: string
          id?: string
          session_id?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lessons_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
      sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          course_name: string
          created_at: string
          description: string | null
          id: string
          max_capacity: number | null
          scheduled_start: string
          session_code: string
          si_leader_id: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          course_name: string
          created_at?: string
          description?: string | null
          id?: string
          max_capacity?: number | null
          scheduled_start: string
          session_code: string
          si_leader_id: string
          status?: Database["public"]["Enums"]["session_status"]
          title: string
          topic: string
          updated_at?: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          course_name?: string
          created_at?: string
          description?: string | null
          id?: string
          max_capacity?: number | null
          scheduled_start?: string
          session_code?: string
          si_leader_id?: string
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
          topic?: string
          updated_at?: string
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
      end_session: {
        Args: { session_uuid: string }
        Returns: boolean
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
      search_lessons: {
        Args: {
          limit_count?: number
          search_term: string
          session_uuid?: string
        }
        Returns: {
          content: Json
          created_at: string
          generated_by: string
          id: string
          relevance_score: number
          session_id: string
          topic: string
        }[]
      }
      start_session: {
        Args: { session_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      session_status: "scheduled" | "active" | "completed" | "cancelled"
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
      session_status: ["scheduled", "active", "completed", "cancelled"],
      user_role: ["si_leader", "student", "coordinator"],
    },
  },
} as const
