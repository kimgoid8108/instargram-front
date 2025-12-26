"use client";

interface CreatePostButtonProps {
  onClick: () => void;
}

export default function CreatePostButton({ onClick }: CreatePostButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      aria-label="새 게시물 만들기"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span>게시물 추가</span>
    </button>
  );
}
