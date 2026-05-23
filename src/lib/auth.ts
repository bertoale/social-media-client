import { apiClient } from "./api.config";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  followers_count: number;
  following_count: number;
  is_followed: boolean;
}

/**
 * Fetches current user info from the API.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await apiClient.get("/api/users/me");
    return response.data.data as UserInfo;
  } catch (error) {
    // 401 means not authenticated
    return null;
  }
}

/**
 * Gets user role by fetching user info from API.
 * Returns null if not authenticated or on error.
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

/**
 * Checks if user is authenticated by validating session.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
