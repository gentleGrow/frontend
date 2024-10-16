"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";
import { assetManagementMockData } from "@/widgets/asset-management-draggable-table/api/mock";
import { useState } from "react";

const filedWidth = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

const minimumWidth = 136;

const AssetManegementDraggableTable = () => {
  const [field, setField] = useState(assetManagementMockData.asset_fields);
  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableData = assetManagementMockData.stock_assets;

  const isFixed = windowWidth / field.length < minimumWidth;

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
    <Table
      fixWidth={isFixed}
      fields={field}
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
      fieldWidth={(key) => fieldSize[key]}
      onFieldChane={() => {}}
      onAddRow={() => {}}
      onDeleteRow={() => {}}
      onReorder={(newFields) => setField(newFields)}
      onResize={(field, size) =>
        setFieldSize((prev) => ({ ...prev, [field]: size }))
      }
    />
  );
};

export default AssetManegementDraggableTable;
