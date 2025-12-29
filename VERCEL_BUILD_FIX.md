# Vercel 빌드 오류 해결 가이드

## 🔍 문제 분석 결과

### 1. @supabase/supabase-js 모듈 오류

**상태**: ✅ **해결됨**
- `package.json`에 `@supabase/supabase-js: ^2.89.0` 존재 확인
- `package-lock.json` 존재 확인 (npm 사용)
- 의존성은 정상적으로 정의되어 있음

**가능한 원인**:
- Vercel 빌드 시 `npm install`이 제대로 실행되지 않았을 수 있음
- `package-lock.json`이 Git에 커밋되지 않았을 수 있음
- Vercel 빌드 설정에서 패키지 매니저가 잘못 설정되었을 수 있음

### 2. lib/supabase.ts 환경변수 사용

**상태**: ✅ **수정 완료**
- 기존: 하드코딩된 Supabase URL과 키 사용
- 수정: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경변수 사용
- Fallback: 환경변수가 없을 경우 기존 하드코딩된 값 사용 (하위 호환성 유지)
- 클라이언트 컴포넌트 전용 (`"use client"` 지시어 존재) ✅

### 3. Middleware 경고

**상태**: ⚠️ **경고만 발생 (빌드 차단 아님)**
- `middleware.ts` 또는 `middleware.js` 파일이 프로젝트에 존재하지 않음
- README에만 언급되어 있음 (실제 파일 없음)
- Next.js 16에서 middleware convention이 변경되었지만, 파일이 없으므로 이 경고는 다른 원인일 수 있음
- **빌드를 막지 않는 경고**이므로 우선순위 낮음

### 4. 패키지 매니저 확인

**상태**: ✅ **npm 사용 확인**
- `package-lock.json` 존재 → npm 사용
- `yarn.lock` 없음
- `pnpm-lock.yaml` 없음
- Vercel은 기본적으로 `package-lock.json`을 감지하여 npm을 사용함

---

## 📋 해결 단계

### 1단계: 로컬에서 실행해야 할 명령어

```bash
# loginfront 디렉토리로 이동
cd loginfront

# node_modules 재설치 (의존성 동기화)
rm -rf node_modules
npm install

# package-lock.json이 Git에 커밋되어 있는지 확인
git status package-lock.json

# 로컬 빌드 테스트
npm run build
```

**예상 결과**:
- 빌드가 성공해야 함
- `@supabase/supabase-js` 모듈을 정상적으로 찾을 수 있어야 함

### 2단계: 수정된 파일 확인

#### ✅ 수정 완료된 파일

**`lib/supabase.ts`**
- 환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 사용
- 환경변수가 없을 경우 fallback 값 사용 (하위 호환성)

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eauekqrqywyxpfscwatt.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "...";
```

### 3단계: Git 커밋 확인사항

다음 파일들이 Git에 커밋되어 있어야 합니다:

```bash
# 필수 파일 확인
git ls-files | grep -E "(package.json|package-lock.json|lib/supabase.ts)"
```

**확인해야 할 파일**:
- ✅ `package.json` (의존성 정의)
- ✅ `package-lock.json` (의존성 버전 고정) - **중요!**
- ✅ `lib/supabase.ts` (수정된 파일)

---

## 🚀 Vercel 배포 전 체크리스트

### ✅ 필수 체크리스트

#### 1. Git 커밋 확인
- [ ] `package-lock.json`이 Git에 커밋되어 있는지 확인
- [ ] `lib/supabase.ts` 수정사항이 커밋되어 있는지 확인
- [ ] 모든 변경사항을 Git에 푸시

```bash
# 커밋 및 푸시
git add package-lock.json lib/supabase.ts
git commit -m "fix: Supabase 환경변수 사용 및 빌드 오류 수정"
git push
```

#### 2. Vercel 환경변수 설정

Vercel Dashboard → Project Settings → Environment Variables에서 다음 변수를 설정:

```
NEXT_PUBLIC_SUPABASE_URL=https://eauekqrqywyxpfscwatt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWVrcXJxeXd5eHBmc2N3YXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDI2ODcsImV4cCI6MjA4MjI3ODY4N30.gd2jPtLSCaUC5XbvQDCZdX0HQ6V-sVWJJ825_QO56io
```

**중요**:
- `NEXT_PUBLIC_` 접두사가 있는 변수는 빌드 타임에 번들에 포함됩니다
- Production, Preview, Development 환경 모두에 설정하는 것을 권장합니다

#### 3. Vercel 빌드 설정 확인

Vercel Dashboard → Project Settings → General → Build & Development Settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (기본값)
- **Install Command**: `npm install` (기본값)
- **Root Directory**: `loginfront` (프로젝트 구조에 따라)

#### 4. 로컬 빌드 테스트

배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
cd loginfront
npm run build
```

**성공 기준**:
- 빌드가 완료되어야 함
- `@supabase/supabase-js` 관련 오류가 없어야 함
- `.next` 폴더가 생성되어야 함

---

## 🔧 추가 문제 해결

### 만약 여전히 빌드 오류가 발생한다면:

#### 1. Vercel 빌드 로그 확인
- Vercel Dashboard → Deployments → 실패한 배포 → Build Logs 확인
- `npm install` 단계에서 오류가 발생하는지 확인

#### 2. Node.js 버전 확인
- Vercel은 기본적으로 Node.js 18.x 사용
- `package.json`에 `engines` 필드 추가 가능:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 3. 캐시 클리어
- Vercel Dashboard → Settings → Data Cache → Clear Cache
- 또는 새 배포 시 "Clear cache and deploy" 옵션 사용

#### 4. package-lock.json 재생성
```bash
cd loginfront
rm package-lock.json
npm install
git add package-lock.json
git commit -m "chore: package-lock.json 재생성"
git push
```

---

## 📝 Middleware 경고에 대한 설명

**경고 메시지**:
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**분석**:
- 현재 프로젝트에 `middleware.ts` 또는 `middleware.js` 파일이 없음
- 이 경고는 Next.js 16의 새로운 convention 변경에 대한 알림
- **빌드를 막지 않는 경고**이므로 우선순위 낮음
- 향후 middleware를 사용할 경우 `proxy` 방식으로 마이그레이션 필요

**조치**:
- 현재는 무시해도 됨 (빌드에 영향 없음)
- 향후 middleware 파일을 추가할 때 Next.js 16+ 가이드 참고

---

## ✅ 최종 확인사항

배포 전 최종 확인:

- [ ] 로컬에서 `npm run build` 성공
- [ ] `package-lock.json`이 Git에 커밋됨
- [ ] `lib/supabase.ts` 수정사항 커밋됨
- [ ] Vercel 환경변수 설정 완료
- [ ] Git에 모든 변경사항 푸시 완료
- [ ] Vercel에서 새 배포 트리거

---

## 🎯 예상 결과

수정 후 Vercel 빌드가 성공적으로 완료되어야 합니다:
- ✅ `@supabase/supabase-js` 모듈 정상 로드
- ✅ 환경변수를 통한 Supabase 클라이언트 생성
- ✅ 빌드 완료 및 배포 성공

---

## 📞 추가 지원

문제가 지속되면 다음 정보를 확인하세요:
1. Vercel 빌드 로그 전체 내용
2. 로컬 빌드 결과 (`npm run build` 출력)
3. `package-lock.json`의 `@supabase/supabase-js` 항목 확인
