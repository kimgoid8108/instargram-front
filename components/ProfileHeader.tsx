"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { removeAccessToken } from "@/lib/auth";

// 프로필 페이지 헤더 컴포넌트 (Instagram 스타일)

interface ProfileHeaderProps {
  user: {
    id: number;
    nickname: string;
    email?: string;
    profile_image_url?: string;
    bio?: string;
    website?: string;
    full_name?: string;
  };
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export default function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 통계 값 메모이제이션
  const defaultStats = useMemo(() => stats || { posts: 0, followers: 0, following: 0 }, [stats]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // 핸들러 함수들 메모이제이션
  const handleLogout = useCallback(() => {
    removeAccessToken();
    router.push("/accounts/login");
    router.refresh();
  }, [router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // 프로필 이미지 초기 추출 (메모이제이션)
  const profileInitial = useMemo(() => user.nickname.charAt(0).toUpperCase(), [user.nickname]);

  // 웹사이트 URL 정제 (메모이제이션)
  const websiteDisplay = useMemo(() => {
    if (!user.website) return null;
    return user.website.startsWith("http") ? user.website.replace(/^https?:\/\//, "") : user.website;
  }, [user.website]);

  // 프로필 이미지 URL (캐시 무효화를 위한 timestamp 추가)
  const profileImageUrl = useMemo(() => {
    if (!user.profile_image_url || user.profile_image_url.trim() === '') {
      return null;
    }
    // URL에 timestamp 쿼리스트링 추가 (캐시 무효화)
    const separator = user.profile_image_url.includes('?') ? '&' : '?';
    return `${user.profile_image_url}${separator}t=${Date.now()}`;
  }, [user.profile_image_url]);

  // 프로필 이미지 URL 변경 시 에러 상태 초기화
  useEffect(() => {
    setImageError(false);
  }, [user.profile_image_url]);

  return (
    <div className="w-full bg-white">
      {/* 프로필 영역 */}
      <div className="w-full max-w-[935px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-24 h-24 md:w-[150px] md:h-[150px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
              {profileImageUrl && !imageError ? (
                <img
                  src={profileImageUrl}
                  alt={user.nickname}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  key={user.profile_image_url || 'no-image'}
                  onError={() => {
                    console.error("❌ 이미지 로드 실패:", profileImageUrl);
                    // 이미지 로드 실패 시 기본 아바타로 fallback
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl md:text-5xl font-semibold">{profileInitial}</div>
              )}
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="flex-1 min-w-0">
            {/* 유저네임 + 설정 메뉴 */}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl md:text-2xl font-normal text-gray-900 leading-none">{user.nickname}</h1>

              {/* 인증 배지 (선택적) */}
              {/* <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg> */}

              {/* 설정 메뉴 */}
              <div className="relative flex items-center" ref={menuRef}>
                <button onClick={toggleMenu} className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center" aria-label="설정 메뉴" aria-expanded={isMenuOpen}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-900">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <button onClick={closeMenu} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50">
                        프로필 편집
                      </button>
                      <button
                        onClick={() => {
                          closeMenu();
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 통계 */}
            <ul className="flex gap-8 mb-4">
              <li>
                <span className="font-semibold text-gray-900">{defaultStats.posts}</span>
                <span className="text-gray-900 ml-1">게시물</span>
              </li>
              <li>
                <span className="font-semibold text-gray-900">{defaultStats.followers}</span>
                <span className="text-gray-900 ml-1">팔로워</span>
              </li>
              <li>
                <span className="font-semibold text-gray-900">{defaultStats.following}</span>
                <span className="text-gray-900 ml-1">팔로잉</span>
              </li>
            </ul>

            {/* 이름 */}
            {user.full_name && (
              <div className="mb-2">
                <span className="font-semibold text-gray-900 text-sm">{user.full_name}</span>
              </div>
            )}

            {/* 프로필 설명 (Bio) */}
            {user.bio && (
              <div className="mb-2">
                <p className="text-sm text-gray-900 whitespace-pre-line">{user.bio}</p>
              </div>
            )}

            {/* 외부 링크 */}
            {websiteDisplay && (
              <div className="mb-4">
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {websiteDisplay}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
