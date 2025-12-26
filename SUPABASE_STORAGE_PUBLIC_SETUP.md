# Supabase Storage Public 설정 가이드

## 1. Public Bucket 설정 확인

### Supabase Dashboard에서 확인:
1. **Supabase Dashboard** 접속: https://app.supabase.com
2. 프로젝트 선택
3. 좌측 메뉴 → **Storage** 클릭
4. **Buckets** 탭 선택
5. `profile-images` 버킷 찾기
6. 버킷 클릭하여 상세 페이지 열기
7. **Settings** 탭에서 다음 확인:
   - **Public bucket**: ✅ **반드시 체크되어 있어야 함**
   - 체크되어 있지 않으면 → 체크박스 클릭하여 활성화

### Public bucket이 체크되어 있지 않으면:
- `getPublicUrl()`로 생성한 URL은 접근 불가
- 모든 요청이 `403 Forbidden` 또는 `404 Not Found` 발생
- 이미지가 표시되지 않음

## 2. SELECT(읽기) 정책 추가

### 정책 추가 방법:

1. **Storage → Policies** 클릭
2. `profile-images` 버킷 선택
3. **New Policy** 클릭
4. 다음 설정 입력:
   - **Policy name**: `Allow public read` (또는 원하는 이름)
   - **Allowed operation**: `SELECT` (읽기)
   - **Policy definition**:
     ```sql
     true
     ```
     ⚠️ **주의**: 다른 조건 없이 `true`만 입력
5. **Review** 클릭하여 확인
6. **Save policy** 클릭

### 정책 정의 설명:

```sql
-- ✅ 올바른 정책 (모든 사용자가 읽기 가능)
true

-- ❌ 잘못된 정책 예시 (불필요한 조건 추가)
bucket_id = 'profile-images'
-- 또는
auth.role() = 'authenticated'
```

### 정책이 없으면:
- Public bucket이 활성화되어 있어도
- 정책이 없으면 RLS(Row Level Security)에 의해 접근 차단
- `403 Forbidden` 또는 `new row violates row-level security policy` 에러 발생

## 3. 확인 체크리스트

- [ ] Storage → Buckets → `profile-images` → Settings → **Public bucket** 체크됨
- [ ] Storage → Policies → `profile-images` → **SELECT 정책 존재**
  - Policy definition: `true`
  - Allowed operation: `SELECT`
- [ ] 브라우저에서 Public URL 직접 접근 테스트 성공
- [ ] 이미지가 정상적으로 표시됨

## 4. Public URL 형태

정상적으로 설정된 경우 Public URL 형태:
```
https://{project-id}.supabase.co/storage/v1/object/public/profile-images/profiles/{filename}
```

Public URL이 다음과 같은 형태라면 Public bucket이 활성화되지 않은 것:
```
https://{project-id}.supabase.co/storage/v1/object/sign/profile-images/...?token=...
```
(Signed URL 형태)
