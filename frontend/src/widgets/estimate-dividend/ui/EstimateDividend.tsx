import { BarChartData, DonutChartData } from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";
import { checkHasAccessToken } from "@/entities";

export default async function EstimateDividend() {
  const hasAccessToken = await checkHasAccessToken();

  const estimatedDividendAll: BarChartData = (
    hasAccessToken
      ? await fetchEstimateDividend("every")
      : await fetchDummyEstimateDividend("every")
  ) as BarChartData;

  const estimatedDividendByStock: DonutChartData[] = (
    hasAccessToken
      ? await fetchEstimateDividend("type")
      : await fetchDummyEstimateDividend("type")
  ) as DonutChartData[];

  return (
    <EstimateDividendClient
      estimatedDividendAll={estimatedDividendAll}
      estimatedDividendByStock={estimatedDividendByStock}
    />
  );
}
