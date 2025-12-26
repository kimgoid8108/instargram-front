'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMyProfile, updateProfile } from '@/lib/api';
import { getAccessToken, isAuthenticated } from '@/lib/auth';
import { usePosts } from '@/hooks/usePosts';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileActionButtons from '@/components/ProfileActionButtons';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileEditModal from '@/components/ProfileEditModal';
import CreatePostModal from '@/components/CreatePostModal';
import PostGrid from '@/components/PostGrid';
import PostDetailModal from '@/components/PostDetailModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { User } from '@/types/user';
import type { Post } from '@/types/post';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");

  // 게시물 관련 로직을 커스텀 훅으로 분리
  const { posts, isLoading: isPostsLoading, loadPosts, addPost, removePost } = usePosts();

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
      // /users/me는 JWT 토큰의 sub(userId)를 사용하여 조회하므로
      // URL의 username과 관계없이 항상 현재 로그인한 사용자의 프로필을 반환
      const userData = await getMyProfile(token);

      console.log("📥 프로필 데이터 로드 완료:", userData);
      console.log("  profile_image_url:", userData.profile_image_url);

      // 닉네임은 단순 표시용이므로 URL의 username과 비교 불필요
      // 하지만 URL 일관성을 위해 닉네임이 변경된 경우 올바른 URL로 리다이렉트
      const decodedUsername = decodeURIComponent(username);
      if (userData.nickname !== decodedUsername) {
        const encodedNickname = encodeURIComponent(userData.nickname);
        router.replace(`/${encodedNickname}`);
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

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, loadPosts]);

  const handleProfileUpdate = useCallback((updatedUser: User) => {
    // 프로필 업데이트 후 상태 업데이트
    console.log("🔄 프로필 업데이트 콜백 실행:", updatedUser);
    console.log("  profile_image_url:", updatedUser.profile_image_url);

    setUser(updatedUser);

    // 닉네임이 변경되었으면 URL도 업데이트 (replace 사용으로 히스토리에 쌓이지 않음)
    const decodedUsername = decodeURIComponent(username);
    if (updatedUser.nickname !== decodedUsername) {
      // 한글 닉네임을 올바르게 URL 인코딩
      const encodedNickname = encodeURIComponent(updatedUser.nickname);
      router.replace(`/${encodedNickname}`);
    }
  }, [username, router]);

  const handlePostCreate = useCallback(() => {
    // addPost는 이미 posts state를 업데이트하므로 모달만 닫기
    setIsCreatePostModalOpen(false);
  }, []);

  const handlePostClick = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const handlePostDelete = useCallback(async (post: Post) => {
    try {
      await removePost(post.id, post.image_url);

      // 삭제된 게시물이 현재 선택된 게시물이면 모달 닫기
      if (selectedPost?.id === post.id) {
        setSelectedPost(null);
      }
    } catch (err) {
      console.error("게시물 삭제 실패:", err);
      alert(err instanceof Error ? err.message : "게시물 삭제에 실패했습니다.");
    }
  }, [selectedPost, removePost]);

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

      {/* 게시물 생성 모달 */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSuccess={handlePostCreate}
        onCreatePost={addPost}
      />

      {/* 게시물 상세 모달 */}
      <PostDetailModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />

      {/* 탭 영역 */}
      <ProfileTabs onTabChange={setActiveTab} />

      {/* 게시물 그리드 영역 (posts 탭일 때만 표시) */}
      {activeTab === "posts" && (
        <>
          {isPostsLoading ? (
            <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
              <LoadingSpinner message="게시물을 불러오는 중..." />
            </div>
          ) : (
            <PostGrid
              posts={posts}
              onPostClick={handlePostClick}
              onCreateClick={() => setIsCreatePostModalOpen(true)}
              onPostDelete={handlePostDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
