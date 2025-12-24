// 공통 로딩 스피너 컴포넌트

export default function LoadingSpinner({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
  );
}
