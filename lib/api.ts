// API 클라이언트 - 백엔드와 통신하는 모든 API 호출
import { apiRequest } from './api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    profile_image_url?: string;
  };
}

export interface SignupRequest {
  email: string;
  hashed_password: string;
  nickname: string;
  profile_image_url?: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

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
export interface UpdateProfileRequest {
  nickname?: string;
  profile_image_url?: string;
}

export async function updateProfile(token: string, data: UpdateProfileRequest): Promise<User> {
  return apiRequest<User>('/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
