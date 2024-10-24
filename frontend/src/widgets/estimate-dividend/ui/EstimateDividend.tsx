import { DonutChartData, EstimateDividendAllData } from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";
import { getUser } from "@/entities";

export default async function EstimateDividend() {
  const user = await getUser();
  const [estimatedDividendAll, estimatedDividendByStock] = await Promise.all([
    (user && user.isJoined
      ? fetchEstimateDividend("every")
      : fetchDummyEstimateDividend(
          "every",
        )) as Promise<EstimateDividendAllData>,
    (user && user.isJoined
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
