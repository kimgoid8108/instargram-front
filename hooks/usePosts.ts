"use client";

import { useState, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';
import { getPosts, createPost, deletePost } from '@/lib/posts.api';
import { deletePostImage } from '@/lib/supabase';
import type { Post, CreatePostRequest } from '@/types/post';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  addPost: (data: CreatePostRequest) => Promise<Post>;
  removePost: (postId: number, imageUrl?: string) => Promise<void>;
  clearError: () => void;
}

/**
 * 게시물 관련 로직을 관리하는 커스텀 훅
 */
export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setError('인증이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const postsData = await getPosts(token);
      setPosts(postsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '게시물을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('게시물 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPost = useCallback(async (data: CreatePostRequest): Promise<Post> => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('인증이 필요합니다.');
    }

    try {
      const newPost = await createPost(token, data);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '게시물 생성에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removePost = useCallback(async (postId: number, imageUrl?: string): Promise<void> => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('인증이 필요합니다.');
    }

    try {
      // 1. Supabase Storage에서 이미지 삭제 (실패해도 계속 진행)
      if (imageUrl) {
        try {
          await deletePostImage(imageUrl);
        } catch (imageError) {
          console.warn('이미지 삭제 실패 (무시됨):', imageError);
        }
      }

      // 2. 백엔드에서 게시물 삭제
      await deletePost(token, postId);

      // 3. UI에서 게시물 제거
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '게시물 삭제에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    posts,
    isLoading,
    error,
    loadPosts,
    addPost,
    removePost,
    clearError,
  };
}
