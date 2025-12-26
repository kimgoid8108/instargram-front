"use client";

interface CreatePostCardProps {
  onClick: () => void;
}

export default function CreatePostCard({ onClick }: CreatePostCardProps) {
  return (
    <div
      onClick={onClick}
      className="aspect-square relative cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400"
    >
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span className="text-sm font-medium">게시물 추가</span>
      </div>
    </div>
  );
}
