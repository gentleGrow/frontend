"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import {
  AssetStock,
  StockAsset,
} from "@/widgets/asset-management-draggable-table/types/table";
import { useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";

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

interface AssetManagementDraggableTableProps {
  accessToken: string | null;
  itemNameList: ItemName[];
  brokerList: string[];
  accountList: string[];
}

const AssetManagementDraggableTable = ({
  accessToken,
  itemNameList,
  accountList,
  brokerList,
}: AssetManagementDraggableTableProps) => {
  const { data } = useGetAssetStocks(accessToken);

  const queryClient = useQueryClient();

  const [fields, setFields] = useState(
    data?.asset_fields.map((field) =>
      fieldIemFactory(field, data.asset_fields),
    ) ?? [],
  );
  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableData = data.stock_assets;

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

  const handleValueChange = (key: string, value: any, id: number) => {
    queryClient.setQueryData<AssetStock>(
      keyStore.assetStock.getSummary.queryKey,
      (prev) => {
        if (!prev) return;
        return {
          ...prev,
          stock_assets: prev.stock_assets.map((stock) => {
            if (stock.id === id) {
              return {
                ...stock,
                [key]: {
                  isRequired: stock[key].isRequired,
                  value,
                },
              };
            }
            return stock;
          }),
        };
      },
    );
  };

  return (
    <Table
      fixWidth={isFixed}
      fields={fields}
      dataset={tableData as StockAsset[]}
      headerBuilder={headerBuilder}
      cellBuilder={(key, data, id) => {
        if (key === "종목명") {
          return (
            <ItemNameCell
              selected={data?.value}
              onSelect={(item) => handleValueChange(key, item.name, id)}
              selections={itemNameList}
            />
          );
        }

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

export default AssetManagementDraggableTable;
