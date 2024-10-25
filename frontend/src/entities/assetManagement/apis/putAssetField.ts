import { SERVICE_SERVER_URL } from "@/shared";

export const putAssetField = async (accessToken: string, newFields: string[]) =>
  fetch(`${SERVICE_SERVER_URL}/api/v1/asset-field`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newFields),
  });
