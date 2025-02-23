import { fetchWithTimeout, getServiceUrl } from "@/shared";

interface GetBrokerAccountListResponse {
  investment_bank_list: string[];
  account_list: string[];
}

export const getBrokerAccountList = async (accessToken: string | null) => {
  const response = await fetchWithTimeout(
    `${getServiceUrl()}/api/asset/v1/bank-accounts`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetchWithTimeout broker account list");
  }

  return (await response.json()) as GetBrokerAccountListResponse;
};
