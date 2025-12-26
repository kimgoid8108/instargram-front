import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('instagram_access_token')?.value;

  // 인증이 필요한 경로 체크
  const isProtectedPath = pathname === '/' || pathname.startsWith('/accounts/edit');

  // username 기반 경로 체크 (한글 포함, accounts 제외)
  // 한글을 포함한 모든 문자를 허용하되, 파일 확장자는 제외
  const isUsernamePath =
    /^\/[^\/]+$/.test(pathname) &&
    pathname !== '/' &&
    !pathname.startsWith('/accounts') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.match(/\.\w+$/); // 파일 확장자 제외 (예: .jpg, .png 등)

  // 인증이 필요한 경로에 접근하는데 토큰이 없는 경우만 체크
  // (인증 페이지는 클라이언트 사이드에서 처리)
  if ((isProtectedPath || isUsernamePath) && !accessToken) {
    const loginUrl = new URL('/accounts/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 페이지의 리다이렉트는 클라이언트 사이드에서 처리하도록 제거
  // sessionStorage와 쿠키 불일치로 인한 무한 루프 방지

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
