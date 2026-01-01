import { apiClient } from "@/lib/api.config";
import type { FollowerResponse, FollowingResponse, ApiResponse } from "@/types";

export const followService = {
  followUser: async (followingId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post(`/api/follow/${followingId}`);
    return response.data;
  },

  unfollowUser: async (followingId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/follow/${followingId}`);
    return response.data;
  },
};
