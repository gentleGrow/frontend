export const getServiceUrl = () => {
  if (typeof window === "undefined") {
    return "http://api.gaemischool.com:8000";
  }

  return "/";
};
