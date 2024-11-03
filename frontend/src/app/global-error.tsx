"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex h-full w-full items-center justify-center">
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <div>에러가 발생 했어요. 새로고침 후 다시 시도해 주세요.</div>
        <p>
          <a href="/">홈으로 돌아가기</a>
        </p>
      </body>
    </html>
  );
}
