// Supabase 클라이언트 설정

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.');
}

// 환경 변수가 없을 때 더미 클라이언트 생성 (에러 방지)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// 이미지 업로드 함수
export async function uploadProfileImage(file: File, userId: number): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  const { data, error } = await supabaseClient.storage
    .from('profile-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  // 공개 URL 가져오기
  const { data: { publicUrl } } = supabaseClient.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// 이미지 삭제 함수
export async function deleteProfileImage(imageUrl: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 설정되지 않아 이미지 삭제를 건너뜁니다.');
    return;
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  // URL에서 파일 경로 추출
  const urlParts = imageUrl.split('/');
  const filePath = urlParts.slice(-2).join('/'); // 'profiles/filename.jpg'

  const { error } = await supabaseClient.storage
    .from('profile-images')
    .remove([filePath]);

  if (error) {
    console.error('이미지 삭제 실패:', error);
    // 삭제 실패해도 계속 진행 (이미지가 없을 수도 있음)
  }
}
