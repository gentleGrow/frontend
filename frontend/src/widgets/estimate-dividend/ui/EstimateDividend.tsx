import { DonutChartData, EstimateDividendAllData } from "@/shared";
import fetchDummyEstimateDividend from "../api/fetchDummyEstimateDividend";
import EstimateDividendClient from "./EstimateDividendClient";
import fetchEstimateDividend from "../api/fetchEstimateDividend";
import { getUser } from "@/entities";

export default async function EstimateDividend() {
  const user = await getUser();
  const [estimatedDividendAll, estimatedDividendByStock] = await Promise.all([
    (user && user.isJoined
      ? await fetchEstimateDividend("every")
      : await fetchDummyEstimateDividend("every")) as EstimateDividendAllData,
    (user && user.isJoined
      ? await fetchEstimateDividend("type")
      : await fetchDummyEstimateDividend("type")) as DonutChartData[],
  ]);

  return (
    <EstimateDividendClient
      estimatedDividendAll={estimatedDividendAll}
      estimatedDividendByStock={estimatedDividendByStock}
    />
  );
}
