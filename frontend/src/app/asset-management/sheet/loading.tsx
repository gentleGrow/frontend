"use client";

import AssetSheetSummarySkeleton from "@/widgets/asset-management-summary-card/ui/AssetManagementSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const AssetSheetLoading = () => {
  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex w-full flex-row gap-4">
        <AssetSheetSummarySkeleton />
      </div>
      <div className="flex w-full flex-col gap-3">
        <Skeleton className="h-[24px] w-[53px] rounded-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
};

export default AssetSheetLoading;
