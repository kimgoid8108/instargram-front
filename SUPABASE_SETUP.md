# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입 및 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 다음 정보 확인:
   - Project URL
   - Anon/Public Key

## 2. Storage 버킷 생성

1. Supabase Dashboard → Storage
2. "New bucket" 클릭
3. 버킷 이름: `profile-images`
4. Public bucket: ✅ 체크 (공개 접근 허용)
5. File size limit: 5MB (또는 원하는 크기)
6. Allowed MIME types: `image/*`

## 3. Storage 정책 설정

Storage → Policies → `profile-images` 버킷

### 업로드 정책 (Insert)
```sql
-- 모든 사용자가 업로드 가능하도록 설정
CREATE POLICY "Public Access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-images');
```

### 읽기 정책 (Select)
```sql
-- 모든 사용자가 읽기 가능하도록 설정
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

### 삭제 정책 (Delete)
```sql
-- 모든 사용자가 삭제 가능하도록 설정 (또는 인증된 사용자만)
CREATE POLICY "Public Access"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'profile-images');
```

## 4. 환경 변수 설정

`.env.local` 파일 생성 (프로젝트 루트):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. 확인 사항

- ✅ Supabase 프로젝트 생성 완료
- ✅ Storage 버킷 `profile-images` 생성 완료
- ✅ Storage 정책 설정 완료
- ✅ 환경 변수 설정 완료
- ✅ 프론트엔드 서버 재시작 (`npm run dev`)
