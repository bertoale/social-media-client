"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { postService } from "@/services/postService";
import { likeService } from "@/services/likeService";
import { commentService } from "@/services/commentService";
import { reportService } from "@/services/reportService";
import { Post, Comment } from "@/types";
import { API_URL } from "@/lib/config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  ArchiveRestore,
  Flag,
  Send,
  Reply,
} from "lucide-react";
import { toast } from "sonner";
import { EditPostDialog } from "@/components/post/edit-post-dialog";
import { ReportPostDialog } from "@/components/post/report-post-dialog";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchPostDetail();
    fetchCurrentUser();
  }, [postId]);

  const fetchCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
  };
  const fetchPostDetail = async () => {
    try {
      setLoading(true);

      // Fetch post detail (already includes like_count, comment_count, is_liked from backend)
      const postResponse = await postService.getById(postId);
      if (postResponse.success && postResponse.data) {
        const postData = postResponse.data;
        setPost(postData);

        // Use the data from API response
        setIsLiked(postData.is_liked || false);
        setLikeCount(postData.like_count || 0);

        // Fetch comments
        const commentsRes = await commentService.getCommentTree(postId);
        if (commentsRes.success && commentsRes.data) {
          setComments(commentsRes.data);
        }
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    try {
      if (isLiked) {
        await likeService.unlikePost(postId);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await likeService.likePost(postId);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error: any) {
      if (error?.response?.data?.message === "already liked") {
        setIsLiked(true);
      }
      toast.error("Failed to update like");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await commentService.createComment(postId, {
        content: newComment,
      });

      if (response.success) {
        toast.success("Comment added");
        setNewComment("");
        fetchPostDetail();
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };
  const handleReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    // Find the comment to get the user_id for reply_to_user_id
    const findComment = (comments: Comment[], id: number): Comment | null => {
      for (const comment of comments) {
        if (comment.id === id) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    };

    const targetComment = findComment(comments, commentId);
    if (!targetComment) return;

    try {
      const response = await commentService.replyToComment(postId, commentId, {
        content: replyContent,
        reply_to_user_id: targetComment.user.id,
      });

      if (response.success) {
        toast.success("Reply added");
        setReplyingTo(null);
        setReplyContent("");
        fetchPostDetail();
      }
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editCommentContent.trim()) return;

    try {
      const response = await commentService.updateComment(editingComment.id, {
        content: editCommentContent,
      });

      if (response.success) {
        toast.success("Comment updated");
        setEditingComment(null);
        setEditCommentContent("");
        fetchPostDetail();
      }
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await commentService.deleteComment(commentId);

      if (response.success) {
        toast.success("Comment deleted");
        fetchPostDetail();
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleEditPost = async (
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
        fetchPostDetail();
      }
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await postService.delete(postId);

      if (response.success) {
        toast.success("Post deleted");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };
  const handleArchive = async () => {
    try {
      const response = await postService.archive(postId);

      if (response.success) {
        toast.success("Post archived");
        fetchPostDetail();
      }
    } catch (error: any) {
      console.error("Archive error:", error);
      console.error("Error response:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Failed to archive post");
    }
  };

  const handleUnarchive = async () => {
    try {
      const response = await postService.unarchive(postId);

      if (response.success) {
        toast.success("Post unarchived");
        fetchPostDetail();
      }
    } catch (error: any) {
      console.error("Unarchive error:", error);
      console.error("Error response:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Failed to unarchive post");
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
  const renderComment = (comment: Comment, depth = 0) => {
    const isCommentOwner = currentUserId === comment.user.id;
    const isEditing = editingComment?.id === comment.id;

    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-8 mt-4" : "mt-4"}`}>
        <Card className="border-muted/50 shadow-sm py-0">
          <CardContent className="p-4 space-y-3">
            {" "}
            {/* Header */}
            <div className="flex items-start justify-between">
              <Link
                href={
                  comment.user.id === currentUserId
                    ? "/profile"
                    : `/profile/${comment.user.username}`
                }
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      comment.user?.avatar
                        ? API_URL + comment.user.avatar
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    {comment.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="leading-tight">
                  <p className="text-sm font-medium">
                    {comment.user?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                    {comment.edited && " • edited"}
                  </p>
                </div>
              </Link>

              {isCommentOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-60 hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingComment(comment);
                        setEditCommentContent(comment.content);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {/* Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEditComment}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(null);
                      setEditCommentContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {comment.reply_to_user && (
                  <p className="text-xs text-muted-foreground">
                    Replying to{" "}
                    <span className="font-medium text-primary">
                      @{comment.reply_to_user.username}
                    </span>
                  </p>
                )}
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="mr-1 h-3.5 w-3.5" />
                Reply
              </Button>
            </div>
            {/* Reply Box */}
            {replyingTo === comment.id && (
              <div className="mt-2 ml-6 space-y-2 border-l pl-4">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReply(comment.id)}>
                    <Send className="mr-1 h-4 w-4" />
                    Send
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-6">
        <p className="text-center text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-6">
        <p className="text-center text-muted-foreground">Post not found</p>
      </div>
    );
  }

  const isOwner = currentUserId === post.author_id;

  return (
    <div className="container mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-6">
      {/* Post Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Link
              href={isOwner ? "/profile" : `/profile/${post.author.username}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12">
                <AvatarImage
                  src={
                    post.author.avatar
                      ? API_URL + post.author.avatar
                      : undefined
                  }
                  alt={post.author.username}
                />
                <AvatarFallback>
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm md:text-base">
                  {post.author.username}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              {post.archived && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Archived
                </span>
              )}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditPostOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        post.archived ? handleUnarchive() : handleArchive()
                      }
                    >
                      {post.archived ? (
                        <>
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          Unarchive
                        </>
                      ) : (
                        <>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDeletePost}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {post.image && (
          <div className="relative aspect-video w-full bg-muted">
            <img
              src={API_URL + post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <CardContent className="pt-4 md:pt-6">
          <h1 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold">
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>

        <CardFooter className="flex gap-4 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="gap-2"
            disabled={loadingLike}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? "text-red-500" : "text-muted-foreground"
              }`}
              fill={isLiked ? "red" : "none"}
            />
            <span>{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Add Comment */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Add Comment</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>

      {/* Edit Post Dialog */}
      <EditPostDialog
        post={post}
        open={isEditPostOpen}
        onOpenChange={setIsEditPostOpen}
        onSave={handleEditPost}
      />

      {/* Report Post Dialog */}
      <ReportPostDialog
        postId={postId}
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        onReport={handleReport}
      />
    </div>
  );
}
