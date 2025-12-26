"use client";

import { useEffect, useCallback, useState } from "react";
import type { Post } from "@/types/post";

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDetailModal({
  post,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  // 이미지 에러 상태 초기화
  useEffect(() => {
    if (post) {
      setImageError(false);
    }
  }, [post]);
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  if (!isOpen || !post) return null;

  const user = post.user;
  const userNickname = user?.nickname || "알 수 없음";
  const userProfileImage = user?.profile_image_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* 왼쪽: 이미지 영역 */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center aspect-square md:aspect-auto md:min-h-[600px]">
          {!imageError ? (
            <img
              src={post.image_url}
              alt={post.content || "게시물 이미지"}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-2 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="text-sm text-gray-400">이미지를 불러올 수 없습니다</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 텍스트 영역 */}
        <div className="w-full md:w-1/2 flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-300 flex-shrink-0">
            {userProfileImage ? (
              <img
                src={userProfileImage}
                alt={userNickname}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {userNickname.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="font-semibold text-gray-900 flex-1">{userNickname}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-2xl leading-none p-1"
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          {/* 내용 영역 (스크롤 가능) */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* 게시물 내용 */}
            <div className="mb-4">
              <div className="flex items-start gap-3">
                {userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt={userNickname}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {userNickname.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 mr-2">
                    {userNickname}
                  </span>
                  {post.content && (
                    <span className="text-gray-900 whitespace-pre-wrap break-words">
                      {post.content}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 작성 시간 */}
            <div className="text-xs text-gray-500 mt-4">
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
