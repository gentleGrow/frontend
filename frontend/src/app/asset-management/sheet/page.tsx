import { AssetManagementDraggableTable, AssetSheetSummary } from "@/widgets";
import { Suspense } from "react";
import { getItemNameList } from "@/entities/assetManagement/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/assetManagement/apis/getBrokerAccountList";
import { getAssetsStock } from "@/widgets/asset-management-draggable-table/api/getAssetsStock";
import { Skeleton } from "@/components/ui/skeleton";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";

const Sheet = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const response = await Promise.all([
    getItemNameList(accessToken ?? null),
    getBrokerAccountList(accessToken ?? null),
    getAssetsStock(accessToken ?? null),
  ]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      <AssetSheetSummary
        totalAssetAmount={response[2].total_asset_amount}
        totalDividendAmount={response[2].total_dividend_amount}
        totalProfitRate={response[2].total_profit_rate}
        totalInvestAmount={response[2].total_invest_amount}
        totalProfitAmount={response[2].total_profit_amount}
      />
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <AssetManagementDraggableTable
          accessToken={accessToken ?? null}
          accountList={response[1].account_list}
          brokerList={response[1].investment_bank_list}
          itemNameList={response[0]}
        />
      </Suspense>
      {!accessToken ? <AssetManagementAccessGuideButton /> : null}
    </div>
  );
};

export default Sheet;
