import { BarChartData, DonutChartData } from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";
import { checkHasAccessToken } from "@/entities";

export default async function EstimateDividend() {
  const hasAccessToken = await checkHasAccessToken();

  const [estimatedDividendAll, estimatedDividendByStock] = await Promise.all([
    (hasAccessToken
      ? fetchEstimateDividend("every")
      : fetchDummyEstimateDividend("every")) as Promise<BarChartData>,
    (hasAccessToken
      ? fetchEstimateDividend("type")
      : fetchDummyEstimateDividend("type")) as Promise<DonutChartData[]>,
  ]);

  return (
    <EstimateDividendClient
      estimatedDividendAll={estimatedDividendAll}
      estimatedDividendByStock={estimatedDividendByStock}
    />
  );
}
