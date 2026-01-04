"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService";
import { reportService } from "@/services/reportService";
import { Report } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersResponse, postsResponse, reportsResponse] = await Promise.all(
        [
          userService.getExploreUsers(1000, 0),
          postService.getExplorePosts(1000, 0),
          reportService.getAllReports(),
        ]
      );
      const pendingReports =
        reportsResponse.data?.filter((r: Report) => r.status === "pending")
          .length || 0;

      setStats({
        totalUsers: usersResponse.data?.length || 0,
        totalPosts: postsResponse.data?.length || 0,
        totalReports: reportsResponse.data?.length || 0,
        pendingReports,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      href: "/admin/posts",
      color: "text-green-500",
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: AlertCircle,
      href: "/admin/reports",
      color: "text-orange-500",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: TrendingUp,
      href: "/admin/reports",
      color: "text-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your application statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/admin/users">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
          </Link>
          <Link href="/admin/posts">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Manage Posts
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="outline">
              <AlertCircle className="h-4 w-4 mr-2" />
              Review Reports
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
