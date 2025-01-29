interface Options extends RequestInit {
  timeout?: number;
  revalidate?: number;
}

const fetchWithTimeout = async (
  resource: string | URL | globalThis.Request,
  options?: Options,
): Promise<Response> => {
  const {
    timeout = 5000,
    revalidate = 60 * 10,
    ...fetchOptions
  } = options ?? {};

  const controller = new AbortController();

  const abortPromise = new Promise<null>((resolve) => {
    setTimeout(() => {
      controller.abort();
      resolve(null);
    }, timeout);
  });

  const fetchPromise = fetch(resource, {
    ...fetchOptions,
    next: {
      revalidate: revalidate,
    },
    signal: controller.signal,
  });

  const response = await Promise.race([abortPromise, fetchPromise]);

  if (!response) {
    throw new Error("요청시간을 초과했습니다. 네트워크 상태를 확인해주세요.");
  }

  return response;
};

export default fetchWithTimeout;
