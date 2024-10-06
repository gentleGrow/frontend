import {
  BarChartData,
  DonutChartData,
  EstimateDividendAllData,
} from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";
import { cookies } from "next/headers";

export default async function EstimateDividend() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;

  const [estimatedDividendAll, estimatedDividendByStock] = await Promise.all([
    (hasAccessToken
      ? fetchEstimateDividend("every")
      : fetchDummyEstimateDividend(
          "every",
        )) as Promise<EstimateDividendAllData>,
    (hasAccessToken
      ? fetchEstimateDividend("type")
      : fetchDummyEstimateDividend("type")) as Promise<DonutChartData[]>,
  ]);
  console.log(estimatedDividendAll, estimatedDividendByStock);
  return (
    <EstimateDividendClient
      estimatedDividendAll={estimatedDividendAll}
      estimatedDividendByStock={estimatedDividendByStock}
    />
  );
}
