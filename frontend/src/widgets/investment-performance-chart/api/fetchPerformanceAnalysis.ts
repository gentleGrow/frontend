import { LineChartData, SERVICE_SERVER_URL } from "@/shared";
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
      fetch(
        `${SERVICE_SERVER_URL}/api/chart/v1/sample/performance-analysis?interval=5day`,
      ),
      fetch(
        `${SERVICE_SERVER_URL}/api/chart/v1/sample/performance-analysis?interval=1month`,
      ),
      fetch(
        `${SERVICE_SERVER_URL}/api/chart/v1/sample/performance-analysis?interval=3month`,
      ),
      fetch(
        `${SERVICE_SERVER_URL}/api/chart/v1/sample/performance-analysis?interval=6month`,
      ),
      fetch(
        `${SERVICE_SERVER_URL}/api/chart/v1/sample/performance-analysis?interval=1year`,
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
      },
      monthlyPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
      },
      threeMonthPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
      },
      sixMonthPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
      },
      yearlyPerformanceData: {
        xAxises: [],
        values1: { values: [], name: "" },
        values2: { values: [], name: "" },
        unit: "",
      },
    };
  }
};

export default fetchPerformanceAnalysis;
