"use client";

import { Skeleton } from "@/components/ui/skeleton";

const AssetSheetSummarySkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full bg-black except-mobile:hidden" />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="h-[100px] w-1/4 mobile:hidden"
        />
      ))}
    </>
  );
};

export default AssetSheetSummarySkeleton;
