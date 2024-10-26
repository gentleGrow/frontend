import { fetchWithTimeout, getBaseUrl } from "@/shared";

export const putAssetField = async (accessToken: string, newFields: string[]) =>
  fetchWithTimeout(`${getBaseUrl()}/api/v1/asset-field`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newFields),
  });
