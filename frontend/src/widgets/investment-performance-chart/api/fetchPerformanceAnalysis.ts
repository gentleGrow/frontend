import { fetchWithTimeout, LineChartData, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";
export interface PerformanceAnalysisData {
  fiveDayPerformanceData: LineChartData;
  monthlyPerformanceData: LineChartData;
  threeMonthPerformanceData: LineChartData;
  sixMonthPerformanceData: LineChartData;
  yearlyPerformanceData: LineChartData;
}
const fetchPerformanceAnalysis = async (): Promise<PerformanceAnalysisData> => {
  try {
    const [
      fiveDaysResponse,
      oneMonthResponse,
      threeMonthsResponse,
      sixMonthsResponse,
      oneYearResponse,
    ] = await Promise.all([
      fetchWithTimeout(
        `${SERVICE_SERVER_URL}/api/chart/v1/performance-analysis?interval=5day`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
          },
          revalidate: 0,
        },
      ),
      fetchWithTimeout(
        `${SERVICE_SERVER_URL}/api/chart/v1/performance-analysis?interval=1month`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
          },
        },
      ),
      fetchWithTimeout(
        `${SERVICE_SERVER_URL}/api/chart/v1/performance-analysis?interval=3month`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
          },
        },
      ),
      fetchWithTimeout(
        `${SERVICE_SERVER_URL}/api/chart/v1/performance-analysis?interval=6month`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
          },
        },
      ),
      fetchWithTimeout(
        `${SERVICE_SERVER_URL}/api/chart/v1/performance-analysis?interval=1year`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
          },
        },
      ),
    ]);

    if (
      !fiveDaysResponse.ok ||
      !oneMonthResponse.ok ||
      !threeMonthsResponse.ok ||
      !sixMonthsResponse.ok ||
      !oneYearResponse.ok
    ) {
      throw new Error(
        `${fiveDaysResponse.status}: ${await fiveDaysResponse.json()}` +
          `${oneMonthResponse.status}: ${await oneMonthResponse.json()}` +
          `${threeMonthsResponse.status}: ${await threeMonthsResponse.json()}` +
          `${sixMonthsResponse.status}: ${await sixMonthsResponse.json()}` +
          `${oneYearResponse.status}: ${await oneYearResponse.json()}`,
      );
    }
    const [fiveDays, oneMonths, threeMonths, sixMonths, oneYear] =
      await Promise.all([
        fiveDaysResponse.json(),
        oneMonthResponse.json(),
        threeMonthsResponse.json(),
        sixMonthsResponse.json(),
        oneYearResponse.json(),
      ]);
    return {
      fiveDayPerformanceData: fiveDays as LineChartData,
      monthlyPerformanceData: oneMonths as LineChartData,
      threeMonthPerformanceData: threeMonths as LineChartData,
      sixMonthPerformanceData: sixMonths as LineChartData,
      yearlyPerformanceData: oneYear as LineChartData,
    };
  } catch (error) {
    console.error(error);
    return {
      fiveDayPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
        dates: [],
      },
      monthlyPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
        dates: [],
      },
      threeMonthPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
        dates: [],
      },
      sixMonthPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
        dates: [],
      },
      yearlyPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
        dates: [],
      },
    };
  }
};

export default fetchPerformanceAnalysis;
