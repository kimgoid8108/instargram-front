// 인증 페이지 공통 레이아웃 (Instagram 스타일)

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showSignupLink?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showSignupLink = true
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[350px]">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-thin mb-4" style={{ fontFamily: 'Instagram Sans, sans-serif' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-gray-500 font-normal">{subtitle}</p>
          )}
        </div>

        {/* 카드 박스 */}
        <div className="border border-gray-300 rounded-sm bg-white p-8 mb-4">
          {children}
        </div>

        {/* 하단 링크 영역 */}
        {showSignupLink && (
          <div className="border border-gray-300 rounded-sm bg-white p-6 text-center">
            <p className="text-sm text-gray-900">
              계정이 없으신가요?{' '}
              <a href="/accounts/signup" className="text-blue-600 font-semibold">
                가입하기
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
