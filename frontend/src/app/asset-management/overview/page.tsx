import {
  EstimateDividend,
  InvestmentPerformanceChart,
  StockComposition,
  Summary,
} from "@/widgets";
import AssetsAccumulateTrend from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrend";
import { getUser } from "@/entities";

const Overview = async () => {
  const user = await getUser();

  return (
    <div className="flex flex-col gap-4">
      <Summary />
      <div className="grid grid-cols-1 gap-4 except-mobile:grid-cols-5">
        <div className="except-mobile:col-span-2">
          <StockComposition />
        </div>
        <div className="except-mobile:col-span-3">
          <InvestmentPerformanceChart />
        </div>
      </div>
      <div className="grid-cols grid grid-cols-1 gap-4 except-mobile:grid-cols-2">
        <AssetsAccumulateTrend />
        <EstimateDividend />
      </div>
    </div>
  );
};

export default Overview;
