"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { uploadPostImage } from "@/lib/supabase";
import { getAccessToken } from "@/lib/auth";
import { getMyProfile } from "@/lib/api";
import type { Post } from "@/types/post";
import type { CreatePostRequest } from "@/types/post";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCreatePost: (data: CreatePostRequest) => Promise<Post>;
}

export default function CreatePostModal({ isOpen, onClose, onSuccess, onCreatePost }: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 사용자 ID 가져오기
  useEffect(() => {
    if (isOpen) {
      const loadUserId = async () => {
        const token = getAccessToken();
        if (token) {
          try {
            const user = await getMyProfile(token);
            setUserId(user.id);
          } catch (err) {
            console.error("사용자 정보 로드 실패:", err);
          }
        }
      };
      loadUserId();
    }
  }, [isOpen]);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setContent("");
      setError("");
    } else {
      // 모달이 닫힐 때 미리보기 URL 정리
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [isOpen]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      setError("이미지 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 기존 미리보기 URL 정리
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  }, [previewUrl]);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        setError("인증이 필요합니다.");
        setIsLoading(false);
        return;
      }

      if (!selectedFile || !userId) {
        setError("이미지를 선택해주세요.");
        setIsLoading(false);
        return;
      }

      // 1. Supabase에 이미지 업로드
      const imageUrl = await uploadPostImage(selectedFile, userId);

      // 2. 게시물 생성 (onCreatePost는 이미 posts state를 업데이트함)
      await onCreatePost({
        image_url: imageUrl,
        content: content.trim() || undefined,
      });

      // 3. 성공 시 콜백 호출
      onSuccess();
    } catch (err) {
      console.error("게시물 생성 실패:", err);
      setError(err instanceof Error ? err.message : "게시물 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, content, userId, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-[600px] mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">새 게시물 만들기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            aria-label="닫기"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* 이미지 미리보기 영역 */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-[400px] relative">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="게시물 미리보기"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                  aria-label="이미지 제거"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="text-gray-500 text-lg mb-4">사진을 선택하세요</p>
                <label
                  htmlFor="post-image-input"
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  사진 선택
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="post-image-input"
                />
              </div>
            )}
          </div>

          {/* 게시물 내용 입력 영역 */}
          {previewUrl && (
            <div className="p-4 border-t border-gray-300">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문구 입력..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 resize-none"
                rows={4}
                maxLength={2200}
              />
              <p className="mt-2 text-xs text-gray-500 text-right">
                {content.length}/2200
              </p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="px-4 pb-2">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-2 p-4 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>공유 중...</span>
                </>
              ) : (
                "공유"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
