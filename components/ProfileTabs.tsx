"use client";

import { useState, useCallback, useEffect } from "react";

// 탭 버튼 컴포넌트
const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-1 px-4 py-4 border-t ${active ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400"}`} aria-label={label}>
    {icon}
  </button>
);

interface ProfileTabsProps {
  onTabChange?: (tab: "posts" | "saved" | "tagged") => void;
}

export default function ProfileTabs({ onTabChange }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");

  const handleTabChange = useCallback(
    (tab: "posts" | "saved" | "tagged") => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  useEffect(() => {
    onTabChange?.(activeTab);
  }, [activeTab, onTabChange]);

  return (
    <>
      <div className="w-full max-w-[935px] mx-auto border-t border-gray-300">
        <div className="flex justify-center gap-70">
          <TabButton
            active={activeTab === "posts"}
            onClick={() => handleTabChange("posts")}
            label="게시물"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            }
          />
          <TabButton
            active={activeTab === "saved"}
            onClick={() => handleTabChange("saved")}
            label="저장됨"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            }
          />
          <TabButton
            active={activeTab === "tagged"}
            onClick={() => handleTabChange("tagged")}
            label="태그됨"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* 탭 내용 영역 */}
      {activeTab === "saved" && (
        <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
          <div className="text-center text-gray-500 text-sm">저장된 게시물을 확인해보세요</div>
        </div>
      )}

      {activeTab === "tagged" && (
        <div className="w-full max-w-[935px] mx-auto px-4 pb-8 pt-8">
          <div className="text-center text-gray-500 text-sm">태그된 게시물을 확인해보세요</div>
        </div>
      )}
    </>
  );
}
