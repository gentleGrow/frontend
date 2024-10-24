import AssetManagementSummaryCard from "@/widgets/asset-management-summary-card/ui/AssetManagementSummaryCard";
import AssetManagementMobileSummary from "@/widgets/asset-management-summary-card/ui/AssetManagementMobileSummary";

interface AssetSheetSummaryProps {
  totalAssetAmount: number;
  totalInvestAmount: number;
  totalProfitAmount: number;
  totalProfitRate: number;
  totalDividendAmount: number;
}

const AssetSheetSummary = ({
  totalAssetAmount,
  totalInvestAmount,
  totalDividendAmount,
  totalProfitAmount,
  totalProfitRate,
}: AssetSheetSummaryProps) => {
  return (
    <>
      <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-hide mobile:hidden">
        <AssetManagementSummaryCard title="총 자산" value={totalAssetAmount} />
        <AssetManagementSummaryCard
          title="투자 금액"
          value={totalInvestAmount}
        />
        <AssetManagementSummaryCard
          title="수익금"
          value={totalProfitAmount}
          ratio={totalProfitRate}
        />
        <AssetManagementSummaryCard
          title="배당금"
          value={totalDividendAmount}
        />
      </div>
      <AssetManagementMobileSummary
        totalAmount={totalAssetAmount}
        investedAmount={totalInvestAmount}
        profitAmount={totalProfitAmount}
        dividendAmount={totalDividendAmount}
        profitRate={totalProfitRate}
      />
    </>
  );
};

export default AssetSheetSummary;
