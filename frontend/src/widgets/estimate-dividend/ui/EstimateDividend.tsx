import { BarChartData, DonutChartData, FRONT_SERVER_URL } from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";

export default async function EstimateDividend() {
  const hasAccessToken = await fetch(
    `${FRONT_SERVER_URL}/api/user/has-access-token`,
    {
      method: "POST",
    },
  )
    .then((res) => res.json())
    .then((data) => data.hasAccessToken);

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
