import { SERVICE_SERVER_URL } from "@/shared";

interface GetBrokerAccountListResponse {
  investment_bank_list: string[];
  account_list: string[];
}

export const getBrokerAccountList = async (accessToken: string | null) => {
  const response = await fetch(`${SERVICE_SERVER_URL}/api/v1/bank-accounts`);

  if (!response.ok) {
    throw new Error("Failed to fetch broker account list");
  }

  return (await response.json()) as GetBrokerAccountListResponse;
};
