import type { AuthorResponse } from "./user";

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  edited: boolean;
  user: AuthorResponse;
  reply_to_user?: AuthorResponse;
  replies?: Comment[];
}

export interface CommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content?: string;
  edited?: boolean;
}
