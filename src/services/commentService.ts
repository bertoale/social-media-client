import { apiClient } from "@/lib/api.config";
import type {
  Comment,
  CommentRequest,
  UpdateCommentRequest,
  ApiResponse,
} from "@/types";

export const commentService = {
  createComment: async (
    postId: number,
    data: CommentRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post(
      `/api/posts/${postId}/comments`,
      data
    );
    return response.data;
  },

  getCommentTree: async (postId: number): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get(`/api/posts/${postId}/comments`);
    return response.data;
  },
  replyToComment: async (
    postId: number,
    commentId: number,
    data: { content: string; reply_to_user_id: number }
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post(
      `/api/posts/${postId}/comments/${commentId}/reply`,
      data
    );
    return response.data;
  },

  getReplies: async (
    postId: number,
    commentId: number
  ): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get(
      `/api/posts/${postId}/comments/${commentId}/replies`
    );
    return response.data;
  },

  updateComment: async (
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.put(`/api/comments/${commentId}`, data);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/comments/${commentId}`);
    return response.data;
  },
};
