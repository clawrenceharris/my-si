import type {
  Session,
  SessionCheckin,
  ConfusionFeedback,
  SessionStatus,
} from "./database";

// Real-time event types
export type RealtimeEventType = "INSERT" | "UPDATE" | "DELETE";

export type RealtimeEvent<T = any> = {
  eventType: RealtimeEventType;
  new: T;
  old: T;
  schema: string;
  table: string;
  commit_timestamp: string;
};

// Specific real-time update types
export type ConfusionMeterUpdate = {
  session_id: string;
  total_students: number;
  confused_count: number;
  confusion_percentage: number;
  timestamp: string;
  recent_feedback: ConfusionFeedback[];
};

export type SessionUpdate = RealtimeEvent<Session> & {
  type: "session_update";
  session_id: string;
  changes: {
    status?: SessionStatus;
    actual_start?: string;
    actual_end?: string;
    title?: string;
    description?: string;
  };
};

export type CheckinUpdate = RealtimeEvent<SessionCheckin> & {
  type: "checkin_update";
  session_id: string;
  student_name: string;
  total_checkins: number;
};

export type FeedbackUpdate = RealtimeEvent<ConfusionFeedback> & {
  type: "feedback_update";
  session_id: string;
  confusion_stats: ConfusionMeterUpdate;
};

// WebSocket message types
export type WebSocketMessage =
  | ConfusionMeterUpdate
  | SessionUpdate
  | CheckinUpdate
  | FeedbackUpdate;

// Real-time subscription types
export type RealtimeSubscription = {
  id: string;
  channel: string;
  callback: (payload: WebSocketMessage) => void;
  unsubscribe: () => void;
};

// Channel names for different real-time features
export type RealtimeChannel =
  | `session:${string}` // session:session_id
  | `confusion:${string}` // confusion:session_id
  | `checkins:${string}` // checkins:session_id
  | "global_sessions" // All session updates
  | "user_notifications"; // User-specific notifications
