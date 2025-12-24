"use client";

import { useEffect, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
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
    <AuthLayout title="Holystargram" subtitle="친구들의 사진과 동영상을 보려면 로그인하세요.">
      <Suspense fallback={<div className="text-center text-gray-500">로딩 중...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </AuthLayout>
  );
}
