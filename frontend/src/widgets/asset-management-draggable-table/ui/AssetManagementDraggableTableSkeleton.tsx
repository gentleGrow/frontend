import { Skeleton } from "@/components/ui/skeleton";

const AssetManagementDraggableTableSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="h-[24px] w-[53px] rounded-full" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
};

export default AssetManagementDraggableTableSkeleton;
