"use client";

import AssetManagementSummaryCard from "@/widgets/asset-management-summary-card/ui/AssetManagementSummaryCard";
import AssetManagementMobileSummary from "@/widgets/asset-management-summary-card/ui/AssetManagementMobileSummary";
import { useGetAssetStocks } from "@/entities/assetManagement/queries/useGetAssetStocks";

interface AssetSheetSummaryProps {
  accessToken: string | null;
}

const AssetSheetSummary = ({ accessToken }: AssetSheetSummaryProps) => {
  const { data } = useGetAssetStocks(accessToken);

  return (
    <>
      <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-hide mobile:hidden">
        <AssetManagementSummaryCard
          title="총 자산"
          value={data.total_asset_amount}
        />
        <AssetManagementSummaryCard
          title="투자 금액"
          value={data.total_invest_amount}
        />
        <AssetManagementSummaryCard
          title="수익금"
          value={data.total_profit_amount}
          ratio={data.total_profit_rate}
        />
        <AssetManagementSummaryCard
          title="배당금"
          value={data.total_dividend_amount}
        />
      </div>
      <AssetManagementMobileSummary
        totalAmount={data.total_asset_amount}
        investedAmount={data.total_invest_amount}
        profitAmount={data.total_profit_amount}
        dividendAmount={data.total_dividend_amount}
        profitRate={data.total_profit_rate}
      />
    </>
  );
};

// @ts-ignore
export default AssetSheetSummary;
