interface Options {
  [key: string]: any;
}

const fetchWithTimeout = async (resource: string, options: Options = {}) => {
  const { timeout = 5000, revalidate = 60 * 10, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...fetchOptions,
    next: {
      revalidate: revalidate,
    },
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};
export default fetchWithTimeout;
