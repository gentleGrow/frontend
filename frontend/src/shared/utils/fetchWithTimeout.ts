interface Options {
  [key: string]: any;
}

const fetchWithTimeout = async (resource: string, options: Options = {}) => {
  const { timeout = 5000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...fetchOptions,
    next: {
      revalidate: 60 * 10,
    },
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};
export default fetchWithTimeout;
