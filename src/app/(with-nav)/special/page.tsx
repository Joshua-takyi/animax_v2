import { Wrapper } from '@/components/wrapper';
import Link from 'next/link';

export default function Special() {
  return (
    <main className="flex justify-center items-center h-screen ">
      <Wrapper>
        <div className="rounded-lg  p-8   max-w-md w-full text-center flex justify-center items-cente  flex-col items-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Page Coming Soon</h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-4"></div>
            <p className=" mb-6">
              We&quot;re working on something exciting for this page. Please check back later!
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-300"></div>
          </div>

          <Link href="/" className="inline-flex items-center  transition-colors">
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
