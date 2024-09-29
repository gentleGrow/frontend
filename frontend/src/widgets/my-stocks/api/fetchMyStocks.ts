import { SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

export interface MyStock {
  name: string;
  current_price: number;
  profit_rate: number;
  profit_amount: number;
  quantity: number;
}

const fetchMyStocks = async (): Promise<MyStock[]> => {
  try {
    const response = await fetch(
      `${SERVICE_SERVER_URL}/api/chart/v1/my-stock`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN),
        },
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    const myStocks = await response.json().then((data) => data.my_stock_list);

    return myStocks;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchMyStocks;
