import { apiClient, apiPublic } from "@/lib/api.config";
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
  UpdateProfileRequest,
  ApiResponse,
} from "@/types";

export const userService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await apiPublic.post("/api/register", data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiPublic.post("/api/login", data, {
      withCredentials: true, // ⭐ WAJIB
    });

    return response.data;
  },
  logout: async () => {
    await apiPublic.post("/api/logout");
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get("/api/users/me");
    return response.data;
  },

  getUserById: async (userId: number): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserDetailByUsername: async (
    username: string
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/api/users/username/${username}`);
    return response.data;
  },

  getExploreUsers: async (
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get(
      `/api/users/explore?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const formData = new FormData();

    if (data.username) formData.append("username", data.username);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await apiClient.put("/api/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  searchUser: async (keyword: string): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get(
      `/api/users/search?q=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  getFollowers: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get("/api/users/followers");
    return response.data;
  },

  getFollowing: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get("/api/users/followings");
    return response.data;
  },
};
