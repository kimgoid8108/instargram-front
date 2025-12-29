"use client";

// Supabase 클라이언트 설정 (클라이언트 전용)

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 인스턴스 생성
 * 클라이언트 사이드에서만 실행되도록 보장됨
 */
function getSupabaseClient() {
  // 환경변수에서 Supabase 설정 가져오기
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eauekqrqywyxpfscwatt.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWVrcXJxeXd5eHBmc2N3YXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDI2ODcsImV4cCI6MjA4MjI3ODY4N30.gd2jPtLSCaUC5XbvQDCZdX0HQ6V-sVWJJ825_QO56io";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 프로필 이미지 업로드
 */
export async function uploadProfileImage(file: File, userId: number): Promise<string> {
  const supabaseClient = getSupabaseClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  const { data, error } = await supabaseClient.storage.from("profile-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error("업로드 응답에 데이터가 없습니다.");
  }

  // 공개 URL 가져오기 (Public bucket이므로 Public URL 사용)
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("profile-images").getPublicUrl(filePath);

  if (!publicUrl || publicUrl.trim() === "") {
    throw new Error("공개 URL을 가져올 수 없습니다.");
  }

  // Public URL 반환 (Signed URL이 아닌 영구 URL)
  // 형태: https://{project-id}.supabase.co/storage/v1/object/public/profile-images/{filePath}
  return publicUrl;
}

/**
 * 프로필 이미지 삭제
 */
export async function deleteProfileImage(imageUrl: string): Promise<void> {
  try {
    const supabaseClient = getSupabaseClient();

    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split("/");
    const filePath = urlParts.slice(-2).join("/"); // 'profiles/filename.jpg'

    const { error } = await supabaseClient.storage.from("profile-images").remove([filePath]);

    if (error) {
      // 삭제 실패해도 계속 진행 (이미지가 없을 수도 있음)
      // 에러 로깅은 개발 환경에서만
      if (process.env.NODE_ENV === "development") {
        console.error("이미지 삭제 실패:", error);
      }
    }
  } catch (error) {
    // 에러는 throw하지 않고 무시 (삭제 실패해도 프로필 업데이트는 진행)
    if (process.env.NODE_ENV === "development") {
      console.warn("이미지 삭제 중 오류 발생 (무시됨):", error);
    }
  }
}

/**
 * 게시물 이미지 업로드
 */
export async function uploadPostImage(file: File, userId: number): Promise<string> {
  const supabaseClient = getSupabaseClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { data, error } = await supabaseClient.storage.from("post-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error("업로드 응답에 데이터가 없습니다.");
  }

  // 공개 URL 가져오기 (Public bucket이므로 Public URL 사용)
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

  if (!publicUrl || publicUrl.trim() === "") {
    throw new Error("공개 URL을 가져올 수 없습니다.");
  }

  // Public URL 반환 (Signed URL이 아닌 영구 URL)
  // 형태: https://{project-id}.supabase.co/storage/v1/object/public/post-images/{filePath}
  return publicUrl;
}

/**
 * 게시물 이미지 삭제
 */
export async function deletePostImage(imageUrl: string): Promise<void> {
  try {
    const supabaseClient = getSupabaseClient();

    // URL에서 파일 경로 추출
    // 형태: https://{project-id}.supabase.co/storage/v1/object/public/post-images/posts/{fileName}
    const urlParts = imageUrl.split("/");
    const filePath = urlParts.slice(-2).join("/"); // 'posts/filename.jpg'

    const { error } = await supabaseClient.storage.from("post-images").remove([filePath]);

    if (error) {
      // 삭제 실패해도 계속 진행 (이미지가 없을 수도 있음)
      if (process.env.NODE_ENV === "development") {
        console.error("게시물 이미지 삭제 실패:", error);
      }
    }
  } catch (error) {
    // 에러는 throw하지 않고 무시 (삭제 실패해도 게시물 삭제는 진행)
    if (process.env.NODE_ENV === "development") {
      console.warn("게시물 이미지 삭제 중 오류 발생 (무시됨):", error);
    }
  }
}
