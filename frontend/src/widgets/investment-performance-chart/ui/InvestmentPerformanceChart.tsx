import { cookies } from "next/headers";
import fetchPerformanceAnalysis from "../api/fetchPerformanceAnalysis";
import InvestmentPerformanceChartClient from "./InvestmentPerformanceChartClient";
import fetchPerformanceSampleAnalysis from "../api/fetchPerformanceSampleAnalysis";

export default async function InvestmentPerformanceChart() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;

  const performanceData = hasAccessToken
    ? await fetchPerformanceAnalysis()
    : await fetchPerformanceSampleAnalysis();
  return <InvestmentPerformanceChartClient performanceData={performanceData} />;
}
