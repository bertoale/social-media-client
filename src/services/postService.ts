import { apiClient } from "@/lib/api.config";
import type {
  Post,
  PostRequest,
  UpdatePostRequest,
  ApiResponse,
} from "@/types";

export const postService = {
  getAllUnarchived: async (): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get("/api/posts");
    return response.data;
  },

  getById: async (postId: number): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
  },

  create: async (data: PostRequest): Promise<ApiResponse<Post>> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (
    postId: number,
    data: UpdatePostRequest
  ): Promise<ApiResponse<Post>> => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.archived !== undefined)
      formData.append("archived", String(data.archived));
    if (data.edited !== undefined)
      formData.append("edited", String(data.edited));
    const response = await apiClient.put(`/api/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data;
  },

  getPostsByAuthor: async (authorId: number): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get(`/api/posts/author/${authorId}`);
    return response.data;
  },

  getAllByCurrentUser: async (): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get("/api/posts/author/me");
    return response.data;
  },

  archive: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch(`/api/posts/${postId}/archive`);
    return response.data;
  },

  unarchive: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch(`/api/posts/${postId}/unarchive`);
    return response.data;
  },

  getPostsByFollowing: async (): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get("/api/posts/following");
    return response.data;
  },

  getLikedPost: async (): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get("/api/posts/liked/me");
    return response.data;
  },

  getExplorePosts: async (
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get(
      `/api/posts?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },
};
