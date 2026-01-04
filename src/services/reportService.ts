import { apiClient } from "@/lib/api.config";
import type { Report, ReportRequest, ReportStatus, ApiResponse } from "@/types";

export const reportService = {
  createReport: async (
    postId: number,
    data: ReportRequest
  ): Promise<ApiResponse<Report>> => {
    const response = await apiClient.post(`/api/posts/${postId}/reports`, data);
    return response.data;
  },

  getReportById: async (reportId: number): Promise<ApiResponse<Report>> => {
    const response = await apiClient.get(`/api/reports/${reportId}`);
    return response.data;
  },

  getAllReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await apiClient.get("/api/reports");
    return response.data;
  },
  updateReportStatus: async (
    reportId: number,
    status: ReportStatus
  ): Promise<ApiResponse<Report>> => {
    const response = await apiClient.put(`/api/reports/${reportId}/status`, {
      status,
    });
    return response.data;
  },
};
