"use client";

// 프로필 편집 및 보관된 스토리 보기 버튼 컴포넌트

interface ProfileActionButtonsProps {
  onEditClick?: () => void;
}

export default function ProfileActionButtons({ onEditClick }: ProfileActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={onEditClick}
        className="flex-1 px-4 py-2 bg-[#f2f2f2] hover:bg-[#e6e6e6] rounded-lg text-sm font-semibold text-gray-900 transition-colors"
      >
        프로필 편집
      </button>
      <button className="flex-1 px-4 py-2 bg-[#f2f2f2] hover:bg-[#e6e6e6] rounded-lg text-sm font-semibold text-gray-900 transition-colors">
        보관된 스토리 보기
      </button>
    </div>
  );
}
