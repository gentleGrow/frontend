export const SERVICE_SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "https://api.gaemischool.com"
    : "https://api.ollass.com";
export const RESPONSE_STATUS = { BAD_REQUEST: 400, INTERNAL_SERVER_ERROR: 500 };
export const API_CHART_SUFFIX = "api/chart/v1/sample";
