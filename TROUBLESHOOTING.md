# 문제 해결 가이드

## "토큰이 제공되지 않는다" 에러 해결

### 1. 백엔드 서버 확인

백엔드 서버가 정상적으로 실행되고 있는지 확인하세요:

```bash
cd loginback
npm run start:dev
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:
```
✅ 서버가 성공적으로 시작되었습니다!
📡 포트: http://localhost:3001

🔍 JWT 환경 변수 확인:
  NODE_ENV: development
  JWT_SECRET: ***설정됨***
```

### 2. JWT_SECRET 환경 변수 확인

백엔드 폴더(`loginback/`)의 `.env` 파일에 `JWT_SECRET`이 설정되어 있는지 확인하세요:

```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

**중요**: JWT_SECRET이 없으면 백엔드 서버가 시작되지 않거나 토큰을 생성할 수 없습니다.

### 3. 브라우저 개발자 도구 확인

1. 브라우저에서 F12를 눌러 개발자 도구 열기
2. **Network** 탭 선택
3. 로그인 시도
4. `/auth/login` 요청 확인:
   - Status가 200인지 확인
   - Response 탭에서 응답 데이터 확인
   - `accessToken` 필드가 있는지 확인

### 4. 콘솔 로그 확인

브라우저 콘솔(Console 탭)에서 다음을 확인:
- 네트워크 에러 메시지
- "로그인 응답:" 메시지
- "로그인 에러:" 메시지

### 5. 일반적인 문제들

#### 문제: 백엔드 서버가 실행되지 않음
**해결**: 백엔드 서버를 먼저 실행하세요.

#### 문제: CORS 에러
**해결**: 백엔드 `.env` 파일에 다음 추가:
```env
CORS_ORIGIN=http://localhost:3000
```

#### 문제: JWT_SECRET이 설정되지 않음
**해결**: 백엔드 `.env` 파일에 JWT_SECRET 추가:
```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

#### 문제: 데이터베이스 연결 실패
**해결**: 백엔드 `.env` 파일에 데이터베이스 설정 확인:
```env
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
DB_SSL=false
```

### 6. API 테스트

Postman이나 curl로 직접 API를 테스트해보세요:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

응답에 `accessToken`이 포함되어 있는지 확인하세요.

### 7. 프론트엔드 환경 변수 확인

프론트엔드 폴더(`loginfront/`)에 `.env.local` 파일이 있고 올바른 URL이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 8. 여전히 문제가 있다면

1. 브라우저 개발자 도구의 Network 탭에서 실제 응답 확인
2. 백엔드 터미널에서 에러 로그 확인
3. 브라우저 콘솔의 에러 메시지 확인
4. 위의 모든 단계를 다시 확인
