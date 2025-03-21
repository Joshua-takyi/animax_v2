import { Wrapper } from '@/components/wrapper';
import Link from 'next/link';

export default function Special() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-50">
      <Wrapper>
        <div className="rounded-lg border border-gray-200 p-8 shadow-md bg-white max-w-md w-full text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Coming Soon</h1>
            <div className="h-1 w-20 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-6">
              We&quot;re working on something exciting for this page. Please check back later!
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Home
          </Link>
        </div>
      </Wrapper>
    </main>
  );
}
