export type ReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export interface Report {
  id: number;
  user_id: number;
  post_id: number;
  reason: string;
  status: ReportStatus;
  admin_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ReportRequest {
  reason: string;
  description?: string;
}

export interface UpdateReportRequest {
  status: ReportStatus;
}
