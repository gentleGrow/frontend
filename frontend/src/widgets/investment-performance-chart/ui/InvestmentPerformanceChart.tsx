import fetchPerformanceAnalysis from "../api/fetchPerformanceAnalysis";
import InvestmentPerformanceChartClient from "./InvestmentPerformanceChartClient";

export default async function InvestmentPerformanceChart() {
  const performanceData = await fetchPerformanceAnalysis();

  return <InvestmentPerformanceChartClient performanceData={performanceData} />;
}
