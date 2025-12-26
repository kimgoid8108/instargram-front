import { apiRequest } from './api-client';
import type { Post, CreatePostRequest } from '@/types/post';

/**
 * 게시물 생성 API
 */
export async function createPost(token: string, data: CreatePostRequest): Promise<Post> {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * 게시물 목록 조회 API
 */
export async function getPosts(token: string): Promise<Post[]> {
  return apiRequest<Post[]>('/posts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * 게시물 삭제 API
 */
export async function deletePost(token: string, postId: number): Promise<void> {
  return apiRequest<void>(`/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
