import { DonutChartData, fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const fetchComposition = async (
  type: "composition" | "account" = "composition",
): Promise<DonutChartData[]> => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/chart/v1/composition?type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
        revalidate: 0,
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchComposition;
