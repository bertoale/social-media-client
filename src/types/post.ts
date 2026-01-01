import type { AuthorResponse } from "./user";

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  archived: boolean;
  edited: boolean;
  author_id: number;
  created_at: string;
  author: AuthorResponse;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
}

export interface PostRequest {
  title: string;
  content: string;
  image?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  archived?: boolean;
  edited?: boolean;
}
