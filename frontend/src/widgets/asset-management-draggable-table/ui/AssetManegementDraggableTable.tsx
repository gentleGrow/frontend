"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";
import { assetManagementMockData } from "@/widgets/asset-management-draggable-table/api/mock";

const filedWidth = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

const minimumWidth = 80;

const AssetManegementDraggableTable = () => {
  const windowWidth = useWindowWidth();

  const tableData = assetManagementMockData.stock_assets;
  const fieldList = assetManagementMockData.asset_fields;

  const isFixed = windowWidth / fieldList.length < minimumWidth * 1.5;

  const headerBuilder = (key: string) => (
    <div
      className={cn(
        "text-right",
        typeof tableData[0][key] === "number" ? "text-right" : "text-start",
      )}
    >
      {key}
    </div>
  );

  return (
    <div className={"w-full overflow-x-auto scrollbar-hide"}>
      <Table
        fixWidth={isFixed}
        fields={fieldList}
        dataset={tableData as StockAsset[]}
        headerBuilder={headerBuilder}
        cellBuilder={(key, data) => {
          return (
            <input
              className={cn(
                "box-border h-full w-full px-2.5 py-[12.5px] focus:outline-green-50",
                typeof data[key] === "number" ? "text-right" : "text-start",
              )}
              defaultValue={String(data?.value ?? "")}
            />
          );
        }}
        fieldWidth={(key) => filedWidth[key]}
        onFieldChane={() => {}}
        onAddRow={() => {}}
        onDeleteRow={() => {}}
      />
    </div>
  );
};

export default AssetManegementDraggableTable;
