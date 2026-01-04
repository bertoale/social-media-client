"use client";

import { useEffect, useState } from "react";
import { postService } from "@/services/postService";
import { reportService } from "@/services/reportService";
import { userService } from "@/services/userService";
import { Post } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { EditPostDialog } from "@/components/post/edit-post-dialog";
import { ReportPostDialog } from "@/components/post/report-post-dialog";
import { toast } from "sonner";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response.success && response.data) {
        setCurrentUserId(response.data.id);
      }
    } catch (e) {
      console.error("Failed to fetch current user:", e);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // API already returns like_count, comment_count, is_liked
      const response = await postService.getPostsByFollowing();
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-screen p-6">
        <p className="text-center text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  const handleEditSave = async (
    postId: number,
    title: string,
    content: string
  ) => {
    try {
      const response = await postService.update(postId, {
        title,
        content,
        edited: true,
      });

      if (response.success) {
        toast.success("Post updated");
        fetchPosts();
      }
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleReport = async (
    postId: number,
    reason: string,
    description: string
  ) => {
    try {
      const response = await reportService.createReport(postId, {
        reason,
        description,
      });

      if (response.success) {
        toast.success("Report submitted");
      }
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="container mx-auto max-w-full px-4 md:px-6 py-4 md:py-6">
      <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl font-bold">Feed</h1>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>No posts to show. Follow users to see their posts here.</p>
        </div>
      ) : (
        <>
          <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold">
            All Posts
          </h2>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="feed" />
            ))}
          </div>
        </>
      )}

      {/* Edit Post Dialog */}
      <EditPostDialog
        post={editingPost}
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onSave={handleEditSave}
      />

      {/* Report Post Dialog */}
      <ReportPostDialog
        postId={reportingPostId}
        open={!!reportingPostId}
        onOpenChange={(open) => !open && setReportingPostId(null)}
        onReport={handleReport}
      />
    </div>
  );
}
