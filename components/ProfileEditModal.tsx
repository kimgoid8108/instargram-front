"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { updateProfile } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { uploadProfileImage, deleteProfileImage } from "@/lib/supabase";
import type { User, UpdateProfileRequest } from "@/types/user";

interface ProfileEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export default function ProfileEditModal({ user, isOpen, onClose, onUpdate }: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(user.nickname);
  const [profileImage, setProfileImage] = useState<File | string | null>(user.profile_image_url || null);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profile_image_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때마다 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setNickname(user.nickname);
      setProfileImage(user.profile_image_url || null);
      setPreviewImage(user.profile_image_url || null);
      setError("");
    }
  }, [isOpen, user]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setProfileImage(file); // File 객체 저장
    setError(""); // Supabase 체크는 uploadProfileImage 호출 시 수행
  }, []);

  const handleRemoveImage = useCallback(() => {
    setProfileImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        setError("인증이 필요합니다.");
        return;
      }

      const updateData: UpdateProfileRequest = {};

      // 닉네임 변경 확인
      if (nickname.trim() !== user.nickname) {
        updateData.nickname = nickname.trim();
      }

      // 이미지 업로드 (변경 버튼 클릭 시에만 실행)
      if (profileImage instanceof File) {
        try {
          console.log("📤 이미지 업로드 시작...");
          const imageUrl = await uploadProfileImage(profileImage, user.id);
          console.log("✅ 업로드 성공, 이미지 URL:", imageUrl);

          updateData.profile_image_url = imageUrl;

          // 기존 이미지가 있으면 삭제
          if (user.profile_image_url) {
            await deleteProfileImage(user.profile_image_url);
          }
        } catch (uploadError) {
          // Supabase 업로드 실패 시 에러 메시지 표시
          console.error("❌ 이미지 업로드 실패:", uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : "이미지 업로드에 실패했습니다.";
          setError(errorMessage);
          setIsLoading(false);
          return;
        }
      } else if (profileImage === null && user.profile_image_url) {
        // 이미지 제거
        try {
          await deleteProfileImage(user.profile_image_url);
          updateData.profile_image_url = "";
        } catch (deleteError) {
          // 삭제 실패해도 계속 진행 (이미지가 없을 수도 있음)
          console.warn('이미지 삭제 실패:', deleteError);
          updateData.profile_image_url = "";
        }
      }

      // 변경사항이 없으면 종료
      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      // 프로필 업데이트
      console.log("📝 백엔드로 업데이트 요청:", updateData);
      const updatedUser = await updateProfile(token, updateData);
      console.log("✅ 백엔드 업데이트 완료, 반환된 사용자 데이터:", updatedUser);
      console.log("  profile_image_url:", updatedUser.profile_image_url);

      // 상태 즉시 반영 (모달 닫기 전)
      setPreviewImage(updatedUser.profile_image_url || null);

      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      setError(err instanceof Error ? err.message : "프로필 업데이트에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [nickname, profileImage, user, onClose, onUpdate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">프로필 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                {previewImage ? (
                  <img src={previewImage} alt="프로필 미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold">
                    {nickname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image-input"
              />
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <label
                  htmlFor="profile-image-input"
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  사진 변경
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    제거
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 닉네임 입력 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              사용자 이름
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="사용자 이름"
              minLength={2}
              maxLength={50}
              required
            />
            <p className="mt-1 text-xs text-gray-500">2자 이상 50자 이하</p>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={isLoading || nickname.trim().length < 2}
            >
              {isLoading ? "변경 중..." : "변경"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
