"use client";

// 공통 에러 메시지 컴포넌트

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-red-500 mb-4">{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
