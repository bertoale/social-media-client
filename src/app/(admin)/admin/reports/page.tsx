"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Report, ReportStatus } from "@/types";
import { API_URL } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAllReports();
      if (response.success && response.data) {
        setReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (reportId: number, status: ReportStatus) => {
    try {
      const response = await reportService.updateReportStatus(reportId, status);
      if (response.success) {
        toast.success(`Report marked as ${status}`);
        setReports(
          reports.map((report) =>
            report.id === reportId ? { ...report, status } : report
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update report status");
    }
  };

  const filteredReports = reports.filter((report) =>
    filterStatus === "all" ? true : report.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Report List</h1>
          <p className="text-muted-foreground">
            Review and manage user reports
          </p>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by status:</label>{" "}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reports found
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
                >
                  {" "}
                  {/* Report Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {report.reporter && (
                        <>
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                report.reporter.avatar
                                  ? API_URL + report.reporter.avatar
                                  : undefined
                              }
                              alt={report.reporter.username}
                            />
                            <AvatarFallback>
                              {report.reporter.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {report.reporter.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(report.created_at).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                      {!report.reporter && (
                        <div>
                          <p className="font-semibold">
                            User #{report.user_id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {getStatusBadge(report.status)}
                  </div>{" "}
                  {/* Report Details */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Reason: </span>
                      <span className="text-sm text-muted-foreground">
                        {report.reason}
                      </span>
                    </div>
                    {report.description && (
                      <div>
                        <span className="text-sm font-medium">
                          Description:{" "}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">
                        Reported Post:{" "}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ID #{report.post_id}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/post/${report.post_id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Post
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(report.id, "reviewed")
                          }
                        >
                          Mark as Reviewed
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() =>
                            handleUpdateStatus(report.id, "resolved")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(report.id, "rejected")
                          }
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
