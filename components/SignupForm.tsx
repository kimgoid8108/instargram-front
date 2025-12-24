'use client';

import { useState, FormEvent, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(
    () => email.trim() !== '' && password.trim() !== '' && nickname.trim() !== '',
    [email, password, nickname]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
        await signup({
          email,
          hashed_password: password,
          nickname,
        });

        // 회원가입 성공 시 로그인 페이지로 이동
        router.push('/accounts/login?signup=success');
      } catch (err) {
        setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, nickname, router]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="이메일"
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
          minLength={8}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
          required
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="사용자 이름"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          minLength={2}
          maxLength={50}
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
        {isLoading ? '가입 중...' : '가입하기'}
      </button>
    </form>
  );
}
