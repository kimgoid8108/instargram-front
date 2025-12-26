"use client";

import { useState, memo, useCallback } from "react";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

const PostCard = memo(function PostCard({ post, onClick, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.(post);
  }, [onClick, post]);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (!onDelete) return;

    if (confirm("정말 이 게시물을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      try {
        await onDelete(post);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [onDelete, post]);

  return (
    <div className="relative aspect-square overflow-hidden group">
      <img
        src={post.image_url}
        alt={post.content || "게시물 이미지"}
        className="absolute inset-0 w-full h-full object-cover z-10"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* 클릭 영역 및 hover overlay */}
      <div
        onClick={handleClick}
        className="absolute inset-0 cursor-pointer z-10 bg-transparent group-hover:bg-black group-hover:bg-opacity-20 transition-all flex items-center justify-center"
      >
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 text-white">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="text-sm font-semibold">0</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25S3 16.556 3 12s4.03-8.25 9-8.25 9 3.694 9 8.25z"
              />
            </svg>
            <span className="text-sm font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* 삭제 버튼 (hover 시 표시) */}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed z-30"
          aria-label="게시물 삭제"
          title="게시물 삭제"
          type="button"
        >
          {isDeleting ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
