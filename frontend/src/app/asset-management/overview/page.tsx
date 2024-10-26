// pages/asset/overview/page.tsx

import {
  EstimateDividend,
  InvestmentPerformanceChart,
  StockComposition,
  Summary,
} from "@/widgets";
import AssetsAccumulateTrend from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrend";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";

const Overview = () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;

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
      {!accessToken ? <AssetManagementAccessGuideButton /> : null}
    </div>
  );
};

export default Overview;
