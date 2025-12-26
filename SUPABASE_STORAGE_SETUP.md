# Supabase Storage Bucket 설정 가이드

## 1. Storage Bucket이 반드시 존재해야 하는 이유

- Supabase Storage API는 **사전에 생성된 bucket만** 접근 가능
- `storage.from("bucket-name")` 호출 시 bucket이 없으면 `400 Bad Request - Bucket not found` 에러 발생
- 코드에서 `supabaseClient.storage.from("profile-images")`를 호출하므로, Dashboard에 `profile-images` bucket이 **반드시 존재**해야 함

## 2. Bucket 이름 일치의 중요성

**코드:**
```typescript
supabaseClient.storage.from("profile-images")  // ⚠️ 이 이름과
```

**Dashboard:**
- Storage → Buckets → `profile-images`  // ✅ 이 이름이 정확히 일치해야 함

**일치하지 않으면:**
- `profile-images` vs `profile_images` (언더스코어) → 불일치
- `profile-images` vs `Profile-Images` (대소문자) → 불일치
- `profile-images` vs `profileimages` (하이픈 없음) → 불일치
- 모두 `400 Bad Request - Bucket not found` 에러 발생

## 3. Bucket 생성 방법

### Supabase Dashboard에서 생성:

1. **Supabase Dashboard 접속**
   - https://app.supabase.com
   - 프로젝트 선택

2. **Storage 메뉴 클릭**
   - 좌측 사이드바 → `Storage` 클릭

3. **New bucket 버튼 클릭**
   - 우측 상단 또는 버킷 목록 상단의 `New bucket` 버튼

4. **Bucket 설정**
   - **Name**: `profile-images` (정확히 이 이름으로)
   - **Public bucket**: ✅ **반드시 체크** (이미지 공개 접근용)
   - **File size limit**: `5242880` (5MB, 선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)

5. **Create bucket 클릭**

## 4. Public Bucket 설정 필수 여부

### Public bucket 체크 ✅ 필요:
- 코드에서 `getPublicUrl()`을 사용하여 공개 URL 생성
- `<img src={publicUrl}>`로 브라우저에서 직접 접근
- 인증 없이 이미지 접근 가능

### Public bucket 체크하지 않으면:
- `getPublicUrl()`은 URL을 반환하지만, 실제 접근 시 `403 Forbidden` 발생
- 이미지가 표시되지 않음

**결론: Public bucket으로 설정 필수**

## 5. Storage 정책(RLS) 설정

### 정책이 없으면:
- `anon` 키로 업로드 시도 시 `403 Forbidden` 또는 `new row violates row-level security policy` 에러
- 버킷이 있어도 업로드 실패

### 테스트용 허용 정책 SQL:

**Storage → Policies → `profile-images` 버킷 → New Policy**

#### 1. 업로드 정책 (INSERT):

```sql
-- Policy name: "Allow public upload"
-- Allowed operation: INSERT

CREATE POLICY "Allow public upload"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-images');
```

#### 2. 읽기 정책 (SELECT):

```sql
-- Policy name: "Allow public read"
-- Allowed operation: SELECT

CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

#### 3. 삭제 정책 (DELETE):

```sql
-- Policy name: "Allow public delete"
-- Allowed operation: DELETE

CREATE POLICY "Allow public delete"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'profile-images');
```

### Dashboard에서 정책 추가 방법:

1. **Storage → Policies 클릭**
2. **`profile-images` 버킷 선택**
3. **New Policy 클릭**
4. **Policy 설정:**
   - Policy name 입력
   - Allowed operation 선택 (INSERT / SELECT / DELETE)
   - Policy definition에 SQL 입력 (위 예시 참고)
5. **Save 클릭**
6. **각 정책(INSERT, SELECT, DELETE)을 별도로 추가**

## 확인 체크리스트

- [ ] Supabase Dashboard → Storage → `profile-images` bucket 존재 확인
- [ ] Bucket 이름이 코드의 `"profile-images"`와 정확히 일치하는지 확인
- [ ] Public bucket으로 설정되어 있는지 확인
- [ ] Storage → Policies에서 `profile-images` 버킷에 다음 정책 존재:
  - [ ] INSERT 정책 (업로드)
  - [ ] SELECT 정책 (읽기)
  - [ ] DELETE 정책 (삭제)
- [ ] 브라우저 콘솔에서 `Bucket not found` 에러가 사라졌는지 확인
