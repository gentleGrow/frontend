import { fetchWithTimeout, getServiceUrl } from "@/shared";
import { MyStock } from "./fetchMyStocks";

const fetchDummyMyStocks = async (): Promise<MyStock[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/my-stock`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchDummyMyStocks;
