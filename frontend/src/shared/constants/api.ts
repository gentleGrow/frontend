export const getServiceUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SERVICE_URL;
  }

  return process.env.NEXT_SERVICE_URL;
};

export const RESPONSE_STATUS = { BAD_REQUEST: 400, INTERNAL_SERVER_ERROR: 500 };
export const API_CHART_SUFFIX = "api/chart/v1/sample";
