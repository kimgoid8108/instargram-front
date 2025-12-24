"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/api";
import { getAccessToken, isAuthenticated } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { User } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        router.push("/accounts/login");
        return;
      }

      const token = getAccessToken();
      if (!token) {
        router.push("/accounts/login");
        return;
      }

      try {
        setIsLoading(true);
        const userData = await getMyProfile(token);
        setUser(userData);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
        router.push("/accounts/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      router.push(`/${user.nickname}`);
    }
  }, [user, router]);

  if (isLoading) {
    return <LoadingSpinner message="로딩 중..." />;
  }

  return null;
}
