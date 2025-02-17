const getNodeEnv = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_NODE_ENV;
  }

  return process.env.NODE_ENV;
};

export const SERVICE_SERVER_URL =
  getNodeEnv() === "development"
    ? "https://api.gaemischool.com"
    : "https://api.ollass.com";

export const RESPONSE_STATUS = { BAD_REQUEST: 400, INTERNAL_SERVER_ERROR: 500 };
export const API_CHART_SUFFIX = "api/chart/v1/sample";
