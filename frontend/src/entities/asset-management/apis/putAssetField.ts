import { fetchWithTimeout } from "@/shared";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";

export const putAssetField = async (accessToken: string, newFields: string[]) =>
  fetchWithTimeout(`${getServiceServerUrl()}/api/asset/v1/asset-field`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newFields),
  });
