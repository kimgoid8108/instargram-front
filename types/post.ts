import { User } from './user';

export interface Post {
  id: number;
  user_id: number;
  image_url: string;
  content: string | null;
  created_at: string;
  user?: {
    id: number;
    nickname: string;
    profile_image_url?: string;
  };
}

export interface CreatePostRequest {
  image_url: string;
  content?: string;
}
