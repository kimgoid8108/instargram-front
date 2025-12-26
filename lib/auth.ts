"use client";

// 인증 관련 유틸리티 함수

const ACCESS_TOKEN_KEY = 'instagram_access_token';

// AccessToken 저장 (sessionStorage 사용 - 브라우저 탭 닫으면 사라짐)
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    if (!token || token.trim() === '') {
      console.error('토큰이 비어있습니다:', token);
      throw new Error('유효하지 않은 토큰입니다.');
    }
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    // Cookie에도 저장 (middleware에서 사용) - session cookie로 설정 (브라우저 닫으면 사라짐)
    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
  }
}

// AccessToken 가져오기
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

// AccessToken 제거 (로그아웃)
export function removeAccessToken(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    // Cookie도 제거
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
  }
}

// 로그인 여부 확인
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
