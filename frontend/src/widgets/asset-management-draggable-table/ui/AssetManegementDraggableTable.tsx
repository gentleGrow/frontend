"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";
import { assetManagementMockData } from "@/widgets/asset-management-draggable-table/api/mock";
import { useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";

const filedWidth = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

const minimumWidth = 136;

const fieldIsRequired = (field: string) =>
  field === "종목명" || field === "수량" || field === "구매일자";

const fieldIemFactory = (field: string, userFields: string[]) => ({
  isRequired: fieldIsRequired(field),
  isChecked: userFields.includes(field) || fieldIsRequired(field),
  name: field,
});

const AssetManegementDraggableTable = ({
  accessToken,
}: {
  accessToken: string | null;
}) => {
  const { data } = useGetAssetStocks(accessToken);

  const [fields, setFields] = useState(
    data?.asset_fields.map((field) =>
      fieldIemFactory(field, assetManagementMockData.asset_fields),
    ) ?? [],
  );
  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableData = assetManagementMockData.stock_assets;

  const isFixed = windowWidth / fields.length < minimumWidth;

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

  const handleReset = () => {
    setFields((prev) => {
      return prev.map((field) => {
        if (field.isRequired) {
          return field;
        }

        return {
          ...field,
          isChecked: false,
        };
      });
    });
  };

  return (
    <Table
      fixWidth={isFixed}
      fields={fields}
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
      onFieldChange={() => {}}
      onAddRow={() => {}}
      onDeleteRow={() => {}}
      onReorder={setFields}
      onReset={handleReset}
      onResize={(field, size) =>
        setFieldSize((prev) => ({ ...prev, [field]: size }))
      }
    />
  );
};

export default AssetManegementDraggableTable;
