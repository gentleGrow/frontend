import { AssetManagementDraggableTable, AssetSheetSummary } from "@/widgets";
import { getItemNameList } from "@/entities/asset-management/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/asset-management/apis/getBrokerAccountList";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import AssetSheetSummarySkeleton from "@/widgets/asset-management-summary-card/ui/AssetManagementSkeleton";
import { AsyncBoundary } from "@toss/async-boundary";
import AssetManagementDraggableTableSkeleton from "@/widgets/asset-management-draggable-table/ui/AssetManagementDraggableTableSkeleton";

export const dynamic = "force-dynamic";

const Sheet = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const response = await Promise.all([
    getItemNameList(accessToken ?? null),
    getBrokerAccountList(accessToken ?? null),
  ]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      <AsyncBoundary
        pendingFallback={<AssetSheetSummarySkeleton />}
        rejectedFallback={(props) => <pre>{props.error.message}</pre>}
      >
        <AssetSheetSummary accessToken={accessToken ?? null} />
      </AsyncBoundary>
      <AsyncBoundary
        pendingFallback={<AssetManagementDraggableTableSkeleton />}
        rejectedFallback={(props) => <pre>{props.error.message}</pre>}
      >
        <AssetManagementDraggableTable
          accessToken={accessToken ?? null}
          accountList={response[1].account_list}
          brokerList={response[1].investment_bank_list}
          itemNameList={response[0]}
        />
      </AsyncBoundary>
      {!accessToken ? <AssetManagementAccessGuideButton /> : null}
    </div>
  );
};

export default Sheet;
