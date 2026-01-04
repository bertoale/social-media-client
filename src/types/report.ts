import { User } from "./user";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export interface Report {
  id: number;
  user_id: number;
  post_id: number;
  reason: string;
  description?: string;
  status: ReportStatus;
  admin_id?: number;
  created_at: string;
  updated_at: string;
  reporter?: User; // Optional, untuk admin view
}

export interface ReportRequest {
  reason: string;
  description?: string;
}

export interface UpdateReportRequest {
  status: ReportStatus;
}
