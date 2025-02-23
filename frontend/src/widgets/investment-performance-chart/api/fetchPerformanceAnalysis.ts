import { fetchWithTimeout, getServiceUrl, LineChartData } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";
import { checkIsJoined } from "@/features/login/api/checkIsJoined";

export interface PerformanceAnalysisData {
  fiveDayPerformanceData: LineChartData;
  monthlyPerformanceData: LineChartData;
  threeMonthPerformanceData: LineChartData;
  sixMonthPerformanceData: LineChartData;
  yearlyPerformanceData: LineChartData;
}

const createEmptyChartData = (): LineChartData => ({
  xAxises: [],
  values1: { values: [], name: "" },
  dates: [],
  unit: "",
  values2: { values: [], name: "" },
});

const fetchSamplePerformanceAnalysis = async () => {
  return await Promise.all([
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/performance-analysis?interval=1month`,
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/performance-analysis?interval=3month`,
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/performance-analysis?interval=6month`,
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/performance-analysis?interval=1year`,
    ),
  ]);
};

const fetchUserPerformanceAnalysis = async () => {
  return await Promise.all([
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/performance-analysis?interval=1month`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/performance-analysis?interval=3month`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/performance-analysis?interval=6month`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    ),
    fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/performance-analysis?interval=1year`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    ),
  ]);
};

const fetchPerformanceAnalysis = async (): Promise<PerformanceAnalysisData> => {
  const responses = (await checkIsJoined())
    ? await fetchUserPerformanceAnalysis()
    : await fetchSamplePerformanceAnalysis();

  const keys = [
    "monthlyPerformanceData",
    "threeMonthPerformanceData",
    "sixMonthPerformanceData",
    "yearlyPerformanceData",
  ];

  let result = {};

  for (const [idx, response] of Object.entries(responses)) {
    const key = keys[idx];

    if (!response.ok) {
      result[key] = createEmptyChartData();
      continue;
    }

    result[key] = (await response.json()) as LineChartData;
  }

  return result as PerformanceAnalysisData;
};

export default fetchPerformanceAnalysis;
