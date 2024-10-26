import { SERVICE_SERVER_URL } from "@/shared";

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return SERVICE_SERVER_URL;
}
