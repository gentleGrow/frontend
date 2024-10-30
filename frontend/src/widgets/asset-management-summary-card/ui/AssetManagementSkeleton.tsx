"use client";

import { Skeleton } from "@/components/ui/skeleton";

const AssetSheetSummarySkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full except-mobile:hidden" />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="h-[237px] w-1/4 mobile:hidden"
        />
      ))}
    </>
  );
};

export default AssetSheetSummarySkeleton;
