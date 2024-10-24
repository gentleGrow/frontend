import fetchPerformanceAnalysis from "../api/fetchPerformanceAnalysis";
import InvestmentPerformanceChartClient from "./InvestmentPerformanceChartClient";
import fetchPerformanceSampleAnalysis from "../api/fetchPerformanceSampleAnalysis";
import { getUser } from "@/entities";

export default async function InvestmentPerformanceChart() {
  const user = await getUser();

  const performanceData =
    user && user.isJoined
      ? await fetchPerformanceAnalysis()
      : await fetchPerformanceSampleAnalysis();
  return <InvestmentPerformanceChartClient performanceData={performanceData} />;
}
