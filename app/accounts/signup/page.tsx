"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignupForm from "@/components/SignupForm";
import { isAuthenticated } from "@/lib/auth";

function SignupContent() {
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[350px]">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Instagram Sans, sans-serif" }}>
            Holystargram
          </h1>
          <p className="text-base text-gray-500 font-normal">친구들의 사진과 동영상을 보려면 가입하세요.</p>
        </div>

        {/* 카드 박스 */}
        <div className="border border-gray-300 rounded-sm bg-white p-8 mb-4">
          {signupSuccess && <p className="text-sm text-green-600 text-center mb-4">회원가입이 완료되었습니다. 로그인해주세요.</p>}
          <SignupForm />
        </div>

        {/* 하단 링크 영역 */}
        <div className="border border-gray-300 rounded-sm bg-white p-6 text-center">
          <p className="text-sm text-gray-900">
            계정이 있으신가요?{" "}
            <a href="/accounts/login" className="text-blue-600 font-semibold">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const checkAuth = useCallback(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">로딩 중...</div>}>
      <SignupContent />
    </Suspense>
  );
}
