import { AssetManagementDraggableTable, AssetSheetSummary } from "@/widgets";
import { getItemNameList } from "@/entities/asset-management/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/asset-management/apis/getBrokerAccountList";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import AssetSheetSummarySkeleton from "@/widgets/asset-management-summary-card/ui/AssetManagementSkeleton";
import AssetManagementDraggableTableSkeleton from "@/widgets/asset-management-draggable-table/ui/AssetManagementDraggableTableSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const Sheet = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const response = await Promise.all([
    getItemNameList(accessToken ?? null),
    getBrokerAccountList(accessToken ?? null),
  ]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      <Suspense fallback={<AssetSheetSummarySkeleton />}>
        <AssetSheetSummary accessToken={accessToken ?? null} />
      </Suspense>
      <Suspense fallback={<AssetManagementDraggableTableSkeleton />}>
        <AssetManagementDraggableTable
          accessToken={accessToken ?? null}
          accountList={response[1].account_list}
          brokerList={response[1].investment_bank_list}
          itemNameList={response[0]}
        />
      </Suspense>
    </div>
  );
};

export default Sheet;
