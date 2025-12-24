'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMyProfile } from '@/lib/api';
import { getAccessToken, isAuthenticated } from '@/lib/auth';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileActionButtons from '@/components/ProfileActionButtons';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileEditModal from '@/components/ProfileEditModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { User } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated()) {
      router.push('/accounts/login');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      router.push('/accounts/login');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const userData = await getMyProfile(token);

      // username이 일치하는지 확인
      if (userData.nickname !== username) {
        setError('프로필을 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      setUser(userData);
    } catch (err) {
      console.error('프로필 로드 실패:', err);
      const errorMessage = err instanceof Error ? err.message : '프로필을 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [username, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    // 닉네임이 변경되었으면 URL도 업데이트
    if (updatedUser.nickname !== username) {
      router.replace(`/${updatedUser.nickname}`);
    } else {
      // 같은 페이지에서 프로필만 새로고침
      setUser(updatedUser);
    }
  }, [username, router]);

  if (isLoading) {
    return <LoadingSpinner message="프로필을 불러오는 중..." />;
  }

  if (error || !user) {
    return <ErrorMessage message={error || '프로필을 찾을 수 없습니다.'} onRetry={loadProfile} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 프로필 정보 영역 */}
      <ProfileHeader user={user} />

      {/* 버튼 영역 */}
      <div className="w-full max-w-[935px] mx-auto px-4 pb-4">
        <ProfileActionButtons onEditClick={() => setIsEditModalOpen(true)} />
      </div>

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleProfileUpdate}
      />

      {/* 탭 영역 */}
      <ProfileTabs />

      {/* 게시물 그리드 영역 (나중에 구현) */}
      <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
        <div className="text-center text-gray-500 text-sm">
          아직 게시물이 없습니다.
        </div>
      </div>
    </div>
  );
}
