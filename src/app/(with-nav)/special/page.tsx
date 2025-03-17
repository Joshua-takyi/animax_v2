// page will be added soon

import { Wrapper } from '@/components/wrapper';

export default function Special() {
  return (
    <main className="flex justify-center items-center h-screen">
      <Wrapper>
        <div className="rounded-md border border-gray-200 p-5">
          <h1>Special Page</h1>
          <p>
            This is a special page. You can add your content here. This page is not linked in the
            navigation
          </p>
          <span>
            <a href="/home">Go back to home</a>
          </span>
        </div>
      </Wrapper>
    </main>
  );
}
