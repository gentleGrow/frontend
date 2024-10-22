import { AssetManagementDraggableTable } from "@/widgets";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";
import { getItemNameList } from "@/entities/assetManagement/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/assetManagement/apis/getBrokerAccountList";

const Sheet = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const response = await Promise.all([
    getItemNameList(accessToken ?? null),
    getBrokerAccountList(accessToken ?? null),
  ]);

  return (
    <div>
      <Suspense fallback={<div>테이블 로딩</div>}>
        <AssetManagementDraggableTable
          accessToken={accessToken ?? null}
          accountList={response[1].account_list}
          brokerList={response[1].investment_bank_list}
          itemNameList={response[0]}
        />
      </Suspense>
      <AssetManagementAccessGuideButton />
    </div>
  );
};

export default Sheet;
