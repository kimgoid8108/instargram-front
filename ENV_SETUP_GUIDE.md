# 환경 변수 설정 가이드

## 1. `.env.local` 파일 생성

프로젝트 루트(`loginfront` 폴더)에 `.env.local` 파일을 생성하세요.

## 2. Supabase 프로젝트 정보 가져오기

### Supabase 프로젝트가 없는 경우:
1. [Supabase](https://supabase.com)에 가입 및 로그인
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 이름과 데이터베이스 비밀번호 설정
4. 프로젝트 생성 완료 대기 (약 2분)

### Supabase 프로젝트가 있는 경우:
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Settings** → **API** 클릭
4. 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co` 형식
   - **anon public** 키: 긴 문자열

## 3. Storage 버킷 생성

1. Supabase Dashboard → **Storage** 메뉴 클릭
2. **New bucket** 버튼 클릭
3. 버킷 이름: `profile-images`
4. **Public bucket** 체크 ✅ (공개 접근 허용)
5. **Create bucket** 클릭

## 4. Storage 정책 설정

Storage → Policies → `profile-images` 버킷 선택

### 업로드 정책 추가:
1. **New Policy** 클릭
2. Policy name: `Public Upload`
3. Allowed operation: `INSERT`
4. Policy definition:
```sql
bucket_id = 'profile-images'
```
5. **Save** 클릭

### 읽기 정책 추가:
1. **New Policy** 클릭
2. Policy name: `Public Read`
3. Allowed operation: `SELECT`
4. Policy definition:
```sql
bucket_id = 'profile-images'
```
5. **Save** 클릭

### 삭제 정책 추가:
1. **New Policy** 클릭
2. Policy name: `Public Delete`
3. Allowed operation: `DELETE`
4. Policy definition:
```sql
bucket_id = 'profile-images'
```
5. **Save** 클릭

## 5. `.env.local` 파일 수정

`.env.local` 파일을 열고 Supabase 정보를 입력:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase 설정 (실제 값으로 변경하세요)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 6. 개발 서버 재시작

환경 변수를 변경한 후에는 반드시 개발 서버를 재시작해야 합니다:

```bash
# 서버 중지 (Ctrl + C)
# 서버 재시작
npm run dev
```

## 7. 확인

프로필 편집 모달에서 이미지를 업로드해보세요. 에러가 발생하지 않으면 성공입니다!

## 문제 해결

### 여전히 에러가 발생하는 경우:
1. `.env.local` 파일이 `loginfront` 폴더 루트에 있는지 확인
2. 파일 이름이 정확히 `.env.local`인지 확인 (`.env.local.txt` 아님)
3. 환경 변수 값에 따옴표나 공백이 없는지 확인
4. 개발 서버를 완전히 재시작했는지 확인
5. 브라우저 콘솔에서 환경 변수가 로드되었는지 확인

### 임시 해결책 (Supabase 없이 테스트):
Supabase 설정이 완료되지 않은 경우, 프로필 편집에서 이미지 업로드를 제외하고 닉네임만 변경할 수 있습니다.
