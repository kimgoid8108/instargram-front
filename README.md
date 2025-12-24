# Instagram 클론 프로젝트

Instagram 웹과 유사한 UX/구조를 가진 클론 프로젝트입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript
- **백엔드**: NestJS (별도 폴더)

## 프로젝트 구조

```
loginfront/
├── app/
│   ├── accounts/
│   │   ├── login/          # 로그인 페이지
│   │   └── signup/         # 회원가입 페이지
│   ├── [username]/         # 프로필 페이지 (동적 라우팅)
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 피드 (리다이렉트)
│   └── globals.css         # 전역 스타일
├── components/
│   ├── AuthLayout.tsx      # 인증 페이지 레이아웃
│   ├── LoginForm.tsx       # 로그인 폼
│   ├── SignupForm.tsx     # 회원가입 폼
│   └── ProfileHeader.tsx   # 프로필 헤더
├── lib/
│   ├── api.ts              # API 클라이언트
│   └── auth.ts             # 인증 유틸리티
└── middleware.ts           # 인증 가드
```

## 라우트 구조

- `/accounts/login` - 로그인 페이지
- `/accounts/signup` - 회원가입 페이지
- `/` - 메인 피드 (로그인 후 프로필로 리다이렉트)
- `/[username]` - 사용자 프로필 페이지

## 인증 흐름

1. **로그인 안 된 상태**:
   - `/`, `/[username]` 접근 시 → `/accounts/login`으로 리다이렉트
   - `/accounts/login`, `/accounts/signup` 접근 가능

2. **로그인 된 상태**:
   - `/accounts/login`, `/accounts/signup` 접근 시 → `/`로 리다이렉트
   - `/`, `/[username]` 접근 가능

## 환경 변수 설정

### 프론트엔드 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 백엔드 환경 변수

백엔드 폴더(`loginback/`)의 `.env` 파일에 다음을 설정하세요:

```env
# 데이터베이스 설정
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
DB_SSL=false

# JWT 인증 설정 (필수)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# 서버 설정
PORT=3001
NODE_ENV=development

# CORS 설정 (프론트엔드 URL)
CORS_ORIGIN=http://localhost:3000
```

자세한 연결 가이드는 `CONNECTION_GUIDE.md`를 참고하세요.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 주요 기능

- ✅ Instagram과 유사한 로그인/회원가입 UI
- ✅ JWT 기반 인증
- ✅ 인증 가드 (Middleware + 클라이언트 사이드)
- ✅ 프로필 페이지 (username 기반 라우팅)
- ✅ 반응형 디자인 (모바일 우선)
- ✅ Instagram 스타일의 미니멀한 UI

## 백엔드 API

프로젝트는 다음 백엔드 API를 사용합니다:

- `POST /auth/login` - 로그인
- `POST /users` - 회원가입
- `GET /users/me` - 내 프로필 조회 (JWT 필요)

백엔드는 `loginback/` 폴더에 있습니다.
