'use client';

import { useState, FormEvent, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/api';
import { setAccessToken } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(
    () => email.trim() !== '' && password.trim() !== '',
    [email, password]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
        const response = await login({ email, password });

        // 토큰 확인
        if (!response?.accessToken) {
          console.error('로그인 응답:', response);
          setError('토큰을 받지 못했습니다. 백엔드 서버를 확인하세요.');
          return;
        }

        setAccessToken(response.accessToken);

        // 리다이렉트 처리
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
        router.refresh();
      } catch (err) {
        console.error('로그인 에러:', err);
        setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router, searchParams]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="전화번호, 사용자 이름 또는 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
          required
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`w-full py-1.5 text-sm font-semibold rounded-sm ${
          isFormValid && !isLoading
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-blue-300 text-white cursor-not-allowed'
        } transition-colors`}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
