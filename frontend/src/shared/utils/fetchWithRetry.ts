import fetchWithTimeout, { Options } from "./fetchWithTimeout";

export const fetchWithRetry = async (
  url: string,
  options: Options,
  maxRetries = 3,
): Promise<Response> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...options,
        timeout: options.timeout || 29000 * (i + 1), // 재시도마다 타임아웃 증가
      });
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // 재시도 전 대기
      }
    }
  }
  throw lastError;
};
