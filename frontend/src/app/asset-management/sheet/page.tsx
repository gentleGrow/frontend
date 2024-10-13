import { AssetManagementDraggableTable } from "@/widgets/asset-management-draggable-table";
import { Suspense } from "react";

const Sheet = () => {
  return (
    <div>
      <Suspense fallback={<div>테이블 로딩</div>}>
        <AssetManagementDraggableTable />
      </Suspense>
    </div>
  );
};

export default Sheet;
