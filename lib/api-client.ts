// 공통 API 클라이언트 유틸리티

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
    throw new Error(handleNetworkError(error));
  }

  let responseData: any;

  try {
    responseData = await response.json();
  } catch (error) {
    const statusText = response.statusText || '알 수 없는 오류';
    throw new Error(`서버 응답을 파싱할 수 없습니다 (${response.status}: ${statusText})`);
  }

  if (!response.ok) {
    let errorMessage = '요청에 실패했습니다.';

    // NestJS ValidationPipe 에러 형식 처리
    if (Array.isArray(responseData.message)) {
      errorMessage = responseData.message.join(', ');
    } else if (responseData.message) {
      errorMessage = responseData.message;
    } else if (typeof responseData === 'string') {
      errorMessage = responseData;
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

  return responseData;
}
