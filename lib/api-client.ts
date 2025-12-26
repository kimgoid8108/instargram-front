// 공통 API 클라이언트 유틸리티

const API_BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001';
const REQUEST_TIMEOUT = 10000; // 10초

// 네트워크 에러 처리 헬퍼
function handleNetworkError(error: unknown): string {
  try {
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        return '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.';
      }
      return error.message || '네트워크 오류가 발생했습니다.';
    }
    if (error instanceof Error) {
      return error.message || '알 수 없는 오류가 발생했습니다.';
    }
    if (typeof error === 'string') {
      return error;
    }
    return '알 수 없는 오류가 발생했습니다.';
  } catch {
    return '알 수 없는 오류가 발생했습니다.';
  }
}

// 타임아웃을 포함한 fetch 래퍼
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
}

// 공통 API 요청 함수
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
    );
  } catch (error) {
    // 네트워크 에러를 명확한 에러 메시지로 변환하여 throw
    // 호출하는 쪽(컴포넌트)에서 catch하여 UI에 표시함
    const errorMessage = handleNetworkError(error);
    throw new Error(errorMessage);
  }

  let responseData: unknown;

  // 응답 본문이 있는지 확인
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');

  // 본문이 없거나 빈 응답인 경우 (DELETE 요청 등)
  if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
    // 204 No Content 또는 빈 응답인 경우
    if (response.status === 204 || response.status === 200) {
      return undefined as T;
    }
  }

  try {
    const text = await response.text();
    // 빈 문자열인 경우
    if (!text || text.trim() === '') {
      return undefined as T;
    }
    // JSON 파싱 시도
    responseData = JSON.parse(text) as T;
  } catch (error) {
    // JSON 파싱 실패 시, 응답이 성공이고 본문이 비어있는 경우는 허용
    if (response.ok && (response.status === 204 || response.status === 200)) {
      return undefined as T;
    }
    const statusText = response.statusText || '알 수 없는 오류';
    throw new Error(`서버 응답을 파싱할 수 없습니다 (${response.status}: ${statusText})`);
  }

  if (!response.ok) {
    let errorMessage = '요청에 실패했습니다.';

    // NestJS ValidationPipe 에러 형식 처리
    const errorData = responseData as { message?: string | string[] } | string;
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData && typeof errorData === 'object') {
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }

    // HTTP 상태 코드별 기본 메시지
    if (response.status === 401) {
      errorMessage = '인증이 필요합니다.';
    } else if (response.status === 403) {
      errorMessage = '접근 권한이 없습니다.';
    } else if (response.status === 404) {
      errorMessage = '요청한 리소스를 찾을 수 없습니다.';
    } else if (response.status === 409) {
      errorMessage = '이미 존재하는 데이터입니다.';
    } else if (response.status >= 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    throw new Error(errorMessage);
  }

  return responseData as T;
}
