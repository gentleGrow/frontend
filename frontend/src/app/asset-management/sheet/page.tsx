import { AssetManagementDraggableTable, AssetSheetSummary } from "@/widgets";
import { getItemNameList } from "@/entities/asset-management/apis/getItemNameList";
import { getBrokerAccountList } from "@/entities/asset-management/apis/getBrokerAccountList";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";

export const dynamic = "force-dynamic";

const Sheet = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const response = await Promise.all([
    getItemNameList(accessToken ?? null),
    getBrokerAccountList(accessToken ?? null),
  ]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      <AssetSheetSummary accessToken={accessToken ?? null} />
      <AssetManagementDraggableTable
        accessToken={accessToken ?? null}
        accountList={response[1].account_list}
        brokerList={response[1].investment_bank_list}
        itemNameList={response[0]}
      />
      {!accessToken ? <AssetManagementAccessGuideButton /> : null}
    </div>
  );
};

export default Sheet;
