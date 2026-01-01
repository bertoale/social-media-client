import type { AuthorResponse } from "./user";

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
}

export interface FollowerResponse {
  id: number;
  follower: AuthorResponse;
}

export interface FollowingResponse {
  id: number;
  following: AuthorResponse;
}
