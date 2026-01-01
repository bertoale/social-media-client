import { apiClient } from "@/lib/api.config";
import type { Post, ApiResponse } from "@/types";

export const likeService = {
  likePost: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/posts/${postId}/like`);
    return response.data;
  },

  isPostLiked: async (
    postId: number
  ): Promise<ApiResponse<{ is_liked: boolean }>> => {
    const response = await apiClient.get(`/api/posts/${postId}/like/status`);
    return response.data;
  },

  getPostsLikedByUser: async (userId: number): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get(`/api/users/${userId}/likes`);
    return response.data;
  },

  getPostsLikedByCurrentUser: async (): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get("/api/users/me/likes");
    return response.data;
  },
};
