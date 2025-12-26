"use client";

// 환경 변수 디버깅용 (개발 환경에서만 사용)
export function debugSupabaseEnv() {
  if (typeof window === 'undefined') {
    console.log('⚠️ 서버 사이드에서는 환경 변수를 확인할 수 없습니다.');
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('=== Supabase 환경 변수 확인 ===');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '❌ 설정되지 않음');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '❌ 설정되지 않음');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다!');
    console.log('해결 방법:');
    console.log('1. loginfront/.env.local 파일 확인');
    console.log('2. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 값 확인');
    console.log('3. 개발 서버 재시작 (npm run dev)');
  } else if (supabaseUrl.includes('your-supabase') || supabaseKey.includes('your-supabase')) {
    console.error('❌ placeholder 값이 그대로 있습니다! 실제 Supabase 값으로 변경하세요.');
  } else {
    console.log('✅ 환경 변수가 설정되어 있습니다.');
  }
}
