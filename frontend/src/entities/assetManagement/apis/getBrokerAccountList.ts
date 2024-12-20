import { fetchWithTimeout, getBaseUrl } from "@/shared";

interface GetBrokerAccountListResponse {
  investment_bank_list: string[];
  account_list: string[];
}

export const getBrokerAccountList = async (accessToken: string | null) => {
  const response = await fetchWithTimeout(
    `${getBaseUrl()}/api/asset/v1/bank-accounts`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetchWithTimeout broker account list");
  }

  return (await response.json()) as GetBrokerAccountListResponse;
};
