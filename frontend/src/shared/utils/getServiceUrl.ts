import { SERVICE_SERVER_URL } from "@/shared";

export const getServiceUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  return SERVICE_SERVER_URL;
};
