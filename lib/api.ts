// API 클라이언트 - 백엔드와 통신하는 모든 API 호출
import { apiRequest } from './api-client';
import type { User, LoginRequest, LoginResponse, SignupRequest, UpdateProfileRequest } from '@/types/user';

// 타입은 types/user.ts로 이동
export type { User, LoginRequest, LoginResponse, SignupRequest, UpdateProfileRequest } from '@/types/user';

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const responseData = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // 응답 데이터 검증
  if (!responseData.accessToken) {
    console.error('로그인 응답 데이터:', responseData);
    throw new Error('서버에서 토큰을 받지 못했습니다. 백엔드 설정을 확인하세요.');
  }

  return responseData;
}

// 회원가입 API
export async function signup(data: SignupRequest): Promise<User> {
  return apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 내 프로필 조회 API
export async function getMyProfile(token: string): Promise<User> {
  return apiRequest<User>('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 프로필 업데이트 API
export async function updateProfile(token: string, data: UpdateProfileRequest): Promise<User> {
  return apiRequest<User>('/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

// 게시물 관련 API는 lib/posts.api.ts로 이동
export type { Post, CreatePostRequest } from '@/types/post';
export { createPost, getPosts, deletePost } from './posts.api';
