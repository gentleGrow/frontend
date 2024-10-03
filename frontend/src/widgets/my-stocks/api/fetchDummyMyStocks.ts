import { SERVICE_SERVER_URL } from "@/shared";
import { MyStock } from "./fetchMyStocks";

const fetchDummyMyStocks = async (): Promise<MyStock[]> => {
  try {
    const response = await fetch(
      `${SERVICE_SERVER_URL}/api/chart/v1/sample/my-stock`,
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
