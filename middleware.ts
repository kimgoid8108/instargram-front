import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('instagram_access_token')?.value;

  // 인증이 필요한 경로 체크
  const isProtectedPath = pathname === '/' || pathname.startsWith('/accounts/edit');

  // username 기반 경로 체크 (숫자나 특수문자로 시작하지 않는 경로, accounts 제외)
  const isUsernamePath =
    /^\/[a-zA-Z0-9_]+$/.test(pathname) &&
    pathname !== '/' &&
    !pathname.startsWith('/accounts') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next');

  // 인증 페이지 체크
  const isAuthPath = pathname.startsWith('/accounts/login') || pathname.startsWith('/accounts/signup');

  // 인증이 필요한 경로에 접근하는데 토큰이 없는 경우
  if ((isProtectedPath || isUsernamePath) && !accessToken) {
    const loginUrl = new URL('/accounts/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

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
