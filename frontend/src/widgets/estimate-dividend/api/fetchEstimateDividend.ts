import {
  DonutChartData,
  EstimateDividendAllData,
  fetchWithTimeout,
  SERVICE_SERVER_URL,
} from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const fetchEstimateDividend = async (
  category: "every" | "type" = "every",
): Promise<EstimateDividendAllData | DonutChartData[]> => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/chart/v1/estimate-dividend?category=${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }

    const estimateDividend = await response.json();
    if (
      (Array.isArray(estimateDividend) && estimateDividend.length === 0) ||
      (typeof estimateDividend === "object" &&
        Object.keys(estimateDividend).length === 0)
    ) {
      throw new Error("빈 객체이거나 빈 배열입니다.");
    }
    return estimateDividend;
  } catch (error) {
    console.error(error);

    if (category === "every") {
      return {
        2024: {
          xAxises: [],
          data: [],
          unit: "",
          total: 0,
        },
      };
    }
    return [];
  }
};

export default fetchEstimateDividend;
