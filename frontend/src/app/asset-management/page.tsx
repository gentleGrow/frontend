import { AssetManagementDraggableTable, AssetSheetSummary } from "@/widgets";
import { getItemNameList } from "@/entities/asset-management/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/asset-management/apis/getBrokerAccountList";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import AssetSheetSummarySkeleton from "@/widgets/asset-management-summary-card/ui/AssetManagementSkeleton";
import AssetManagementDraggableTableSkeleton from "@/widgets/asset-management-draggable-table/ui/AssetManagementDraggableTableSkeleton";
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "자산 관리 시트",
  description:
    "직관적인 인터페이스로 자산을 쉽게 입력하고 관리하세요. 실시간 저장과 자동 계산으로 더욱 편리한 자산 관리가 가능합니다.",
  openGraph: {
    title: "자산 관리 시트 | Ollass",
    description:
      "직관적인 인터페이스로 자산을 쉽게 입력하고 관리하세요. 실시간 저장과 자동 계산으로 더욱 편리한 자산 관리가 가능합니다.",
  },
};

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
