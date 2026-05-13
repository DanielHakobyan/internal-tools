export interface Attendee {
  name: string;
  role?: string;
}

export type Priority = "high" | "medium" | "low";
export type Department =
  | "engineering"
  | "design"
  | "marketing"
  | "sales"
  | "ops"
  | "devops"
  | "hr"
  | "finance"
  | "legal"
  | "other";
export type Status = "pending" | "in_progress" | "done";

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string | null;
  priority: Priority;
  department: Department;
  notes: string | null;
  status: Status;
  pushed_to?: string[];
}

export interface MeetingExtraction {
  meeting_title: string;
  meeting_date: string | null;
  duration_estimate: string;
  attendees: Attendee[];
  summary: string;
  action_items: ActionItem[];
  key_decisions: string[];
  blockers: string[];
  follow_up_meeting: string | null;
}

export interface MeetingRecord {
  id: string;
  user_id?: string;
  title: string;
  meeting_date?: string;
  transcript: string;
  summary: string;
  attendees: Attendee[];
  created_at: string;
  action_items?: ActionItem[];
}

export interface IntegrationPayload {
  actionItem: ActionItem;
  meetingTitle: string;
}

export interface IntegrationResult {
  success: boolean;
  message: string;
  url?: string;
  mock?: boolean;
}
