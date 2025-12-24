# 백엔드-프론트엔드 연결 가이드

## 1. 환경 변수 설정

### 프론트엔드 (loginfront)
`.env.local` 파일이 자동으로 생성되었습니다. 필요시 수정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 백엔드 (loginback)
백엔드 폴더의 `.env` 파일에 다음을 설정하세요:

```env
# 데이터베이스 설정
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
DB_SSL=false

# 또는 DATABASE_URL 방식
# DATABASE_URL=postgresql://user:password@host:port/database

# JWT 인증 설정 (필수)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# 서버 설정
PORT=3001
NODE_ENV=development

# CORS 설정 (프론트엔드 URL)
CORS_ORIGIN=http://localhost:3000
```

## 2. 서버 실행 순서

### 1단계: 백엔드 서버 실행
```bash
cd loginback
npm install  # 처음 실행 시
npm run start:dev
```

백엔드가 성공적으로 시작되면:
```
✅ 서버가 성공적으로 시작되었습니다!
📡 포트: http://localhost:3001
```

### 2단계: 프론트엔드 서버 실행
새 터미널에서:
```bash
cd loginfront
npm install  # 처음 실행 시
npm run dev
```

프론트엔드가 성공적으로 시작되면:
```
- Local:        http://localhost:3000
```

## 3. 연결 확인

### API 엔드포인트 테스트

1. **로그인 API 테스트**
   - URL: `http://localhost:3001/auth/login`
   - Method: POST
   - Body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```

2. **회원가입 API 테스트**
   - URL: `http://localhost:3001/users`
   - Method: POST
   - Body:
     ```json
     {
       "email": "test@example.com",
       "hashed_password": "password123",
       "nickname": "testuser"
     }
     ```

3. **프로필 조회 API 테스트**
   - URL: `http://localhost:3001/users/me`
   - Method: GET
   - Headers:
     ```
     Authorization: Bearer {accessToken}
     ```

## 4. 브라우저에서 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. `/accounts/signup`에서 회원가입
3. `/accounts/login`에서 로그인
4. 로그인 성공 시 프로필 페이지로 이동

## 5. 문제 해결

### CORS 에러 발생 시
백엔드 `.env` 파일에 프론트엔드 URL 추가:
```env
CORS_ORIGIN=http://localhost:3000
```

### API 연결 실패 시
1. 백엔드 서버가 실행 중인지 확인
2. 포트 번호 확인 (기본값: 3001)
3. `.env.local` 파일의 `NEXT_PUBLIC_API_URL` 확인
4. 브라우저 개발자 도구의 Network 탭에서 요청 확인

### 인증 에러 발생 시
1. JWT_SECRET이 설정되어 있는지 확인
2. 토큰이 올바르게 저장되는지 확인 (localStorage)
3. Authorization 헤더가 올바르게 전송되는지 확인

## 6. 개발 팁

- **브라우저 개발자 도구**: Network 탭에서 API 요청/응답 확인
- **백엔드 로그**: 터미널에서 API 요청 로그 확인
- **프론트엔드 로그**: 브라우저 콘솔에서 에러 확인

## 7. 프로덕션 배포 시

프로덕션 환경에서는:
- 프론트엔드: `.env.production` 또는 배포 플랫폼의 환경 변수 설정
- 백엔드: `.env` 또는 배포 플랫폼의 환경 변수 설정
- CORS_ORIGIN: 실제 프론트엔드 도메인으로 변경
