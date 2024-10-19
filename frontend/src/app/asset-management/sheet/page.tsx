import { AssetManagementDraggableTable } from "@/widgets";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import AssetManagementAccessGuideButton from "@/widgets/asset-management-guest-access-guide-button/ui/AssetManagementAccessGuideButton";

const Sheet = () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;

  return (
    <div>
      <Suspense fallback={<div>테이블 로딩</div>}>
        <AssetManagementDraggableTable accessToken={accessToken ?? null} />
      </Suspense>
      <AssetManagementAccessGuideButton />
    </div>
  );
};

export default Sheet;
