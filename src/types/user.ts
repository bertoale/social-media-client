export type RoleType = "admin" | "user";

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  role?: RoleType;
  followers_count: number;
  following_count: number;
  is_followed: boolean;
}

export interface AuthorResponse {
  id: number;
  username: string;
  avatar: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatar?: File;
}
