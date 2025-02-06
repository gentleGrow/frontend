import type { Agent } from "https";

export interface Options extends RequestInit {
  timeout?: number;
  revalidate?: number;
  agent?: Agent; // 명확한 타입 지정
}

const fetchWithTimeout = async (
  resource: string | URL | globalThis.Request,
  options?: Options,
): Promise<Response> => {
  const {
    timeout = 29000, // 기본 타임아웃 증가
    revalidate = 60 * 10,
    agent,
    ...fetchOptions
  } = options ?? {};

  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined;

  const abortPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      resolve(null);
    }, timeout);
  });

  try {
    const fetchPromise = fetch(resource, {
      ...fetchOptions,
      next: {
        revalidate: revalidate,
      },
      signal: controller.signal,
      // @ts-expect-error - Next.js fetch 타입과 node-fetch 타입 차이
      agent: agent,
    });

    const response = await Promise.race([abortPromise, fetchPromise]);

    if (!response) {
      throw new Error("요청시간을 초과했습니다. 네트워크 상태를 확인해주세요.");
    }

    return response;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId); // 타이머 정리
    }
  }
};

export default fetchWithTimeout;
