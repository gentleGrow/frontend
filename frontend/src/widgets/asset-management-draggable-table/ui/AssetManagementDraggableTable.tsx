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
import AccountTypeCell from "@/widgets/asset-management-draggable-table/ui/AccountTypeCell";
import { DatePicker, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import { format } from "date-fns";
import NumberInput from "@/shared/ui/NumberInput";
import { useUser } from "@/entities";
import { useSetAtom } from "jotai/index";
import { loginModalAtom } from "@/features";
import SortingButton from "@/widgets/asset-management-draggable-table/ui/SortingButton";

const filedWidth = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

const fieldIsRequired = (field: string) =>
  field === "종목명" || field === "수량" || field === "구매일자";

const numberFields = [
  "수량",
  "현재가",
  "배당금",
  "고가",
  "증권사",
  "저가",
  "시가",
  "수익률",
  "수익금",
  "매입금",
  "매입가",
  "거래량",
];

const fieldTypeIsNumber = (field: string) => {
  return numberFields.includes(field);
};

const autoFilledField = [
  "수익률",
  "시가",
  "고가",
  "저가",
  "거래량",
  "배당금",
  "매입금",
  "현재가",
  "수익금",
];

const cellMinimumWidth = {
  종목명: 150,
  수량: 130,
  구매일자: 136,
  증권사: 156,
  "계좌 종류": 120,
};

const NumberFieldType = {
  Amount: "amount",
  Price: "price",
  Rate: "ratio",
} as const;

const fieldNumberType = (field: string): "amount" | "price" | "ratio" => {
  if (field === "수량" || field === "거래량") {
    return NumberFieldType.Amount;
  }

  if (field === "수익률") {
    return NumberFieldType.Rate;
  }

  return NumberFieldType.Price;
};

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

const getSortType = (field: string): "date" | "number" | "string" => {
  if (field === "구매일자") {
    return "date";
  }

  if (numberFields.includes(field)) {
    return "number";
  }

  return "string";
};

const AssetManagementDraggableTable = ({
  accessToken,
  itemNameList,
  accountList,
  brokerList,
}: AssetManagementDraggableTableProps) => {
  const [currentSorting, setCurrentSorting] = useState<"asc" | "desc">("asc");
  const [sortingField, setSortingField] = useState<string | null>(null);

  const [currencySetting, setCurrencySetting] = useState<"KRW" | "USD">("KRW");
  const { user } = useUser();

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);

  const { data } = useGetAssetStocks(
    accessToken,
    sortingField === null
      ? null
      : {
          sortBy: sortingField,
          sortOrder: currentSorting,
          type: getSortType(sortingField),
        },
  );

  const queryClient = useQueryClient();

  const [fields, setFields] = useState(
    data?.asset_fields.map((field) =>
      fieldIemFactory(field, data.asset_fields),
    ) ?? [],
  );
  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableData = data.stock_assets;

  const tableMinimumWidth = Object.keys(fieldSize).reduce((acc, key) => {
    return acc + (cellMinimumWidth[key] ?? 136);
  }, 0);

  const isFixed = windowWidth - 40 - tableMinimumWidth < 0;

  const headerBuilder = (key: string) => {
    let sorting: "desc" | "asc" = "desc";

    if (key === sortingField) {
      sorting = currentSorting;
    }

    return (
      <div
        className={cn(
          "relative flex flex-row items-center gap-2",
          fieldTypeIsNumber(key) ? "justify-end" : "justify-start",
        )}
      >
        <span>{key}</span>
        <SortingButton
          sorting={sorting}
          isActive={key === sortingField}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!sortingField) {
              setSortingField(key);
              setCurrentSorting("desc");
              return;
            }

            if (key === sortingField) {
              setCurrentSorting(currentSorting === "asc" ? "desc" : "asc");
            } else {
              setSortingField(key);
              setCurrentSorting("asc");
            }
          }}
        />
      </div>
    );
  };

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
    if (!user?.isLoggedIn) {
      setIsOpenLoginModal(true);
      return;
    }

    queryClient.setQueryData<AssetStock>(
      keyStore.assetStock.getSummary.queryKey,
      () => {
        const prev = queryClient.getQueryData<AssetStock>(
          keyStore.assetStock.getSummary.queryKey,
        );
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
    <div className="flex flex-col gap-3 mobile:px-5">
      <header className="flex w-full flex-row items-center justify-between">
        <div className="text-[20px] font-normal">
          총 <span className="font-bold text-green-60">{tableData.length}</span>
          건
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="shrink-0">해외 주식 통화 설정</div>
          <div className="w-[56px] shrink-0">
            <SegmentedButtonGroup>
              <SegmentedButton
                onClick={() => setCurrencySetting("KRW")}
                isSelected={currencySetting === "KRW"}
              >
                ₩
              </SegmentedButton>
              <SegmentedButton
                onClick={() => setCurrencySetting("USD")}
                isSelected={currencySetting === "USD"}
              >
                $
              </SegmentedButton>
            </SegmentedButtonGroup>
          </div>
        </div>
      </header>
      <Table
        fixWidth={isFixed}
        fields={fields}
        dataset={tableData as StockAsset[]}
        headerBuilder={headerBuilder}
        cellBuilder={(key, data, id) => {
          const currentRow = tableData.find((stock) => stock.id === id);
          const currentCurrency = currentRow?.주식통화;
          if (key === "종목명") {
            return (
              <ItemNameCell
                selected={data?.value}
                onSelect={(item) => handleValueChange(key, item.name, id)}
                selections={itemNameList}
              />
            );
          }

          if (key === "계좌종류") {
            return (
              <AccountTypeCell
                selected={data?.value}
                onSelect={(name) => handleValueChange(key, name, id)}
                selections={accountList}
              />
            );
          }

          if (key === "증권사") {
            return (
              <AccountTypeCell
                onSelect={(name) => handleValueChange(key, name, id)}
                selections={brokerList}
                selected={data?.value}
                icon
              />
            );
          }

          if (key === "구매일자") {
            return (
              <div className="flex h-full w-full items-center justify-center px-[9px]">
                <DatePicker
                  date={new Date(data?.value)}
                  onChange={(date) => {
                    const formatedDate = format(date, "yyyy-MM-dd");
                    handleValueChange(key, formatedDate, id);
                  }}
                />
              </div>
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Rate
          ) {
            return (
              <NumberInput
                value={data?.value}
                placeholder="자동 계산 필드입니다."
                type={fieldNumberType(key)}
                variants={
                  !data?.value
                    ? "gray-light"
                    : data?.value > 0
                      ? "increase"
                      : data?.value < 0
                        ? "decrease"
                        : "default"
                }
                autoFill
              />
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Amount
          ) {
            return (
              <NumberInput
                value={data?.value}
                placeholder="자동 계산 필드입니다."
                type={fieldNumberType(key)}
                autoFill
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          if (key === "배당금") {
            return (
              <NumberInput
                value={data?.value}
                type={fieldNumberType(key)}
                region={currentCurrency}
                placeholder={
                  data?.value === undefined
                    ? "자동 계산 필드입니다."
                    : data.value === 0
                      ? "배당금이 없는 종목이에요."
                      : ""
                }
                variants={
                  data?.value === undefined
                    ? "gray-light"
                    : data.value === 0
                      ? "gray-dark"
                      : "default"
                }
                autoFill
              />
            );
          }

          if (key === "수량") {
            return (
              <NumberInput
                value={data?.value}
                onChange={(value) => {}}
                placeholder=""
                type="amount"
                variants="default"
              />
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Price
          ) {
            return (
              <NumberInput
                value={data?.value}
                type={fieldNumberType(key)}
                region={currentCurrency}
                placeholder={"자동 계산 필드입니다."}
                autoFill
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          if (key === "매입가") {
            return (
              <NumberInput
                onChange={(value) => handleValueChange(key, value, id)}
                value={data?.value}
                type={fieldNumberType(key)}
                region={currentCurrency}
                placeholder={currentCurrency === "KRW" ? "₩ 0" : "$ 0"}
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          return;
        }}
        tableWidth={tableMinimumWidth}
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
      <footer className="flex flex-row items-center gap-1">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="7.375"
            stroke="#5D646E"
            strokeWidth="1.25"
          />
          <circle cx="10" cy="6.99219" r="0.75" fill="#5D646E" />
          <rect x="9.375" y="8.75977" width="1.25" height="5" fill="#5D646E" />
        </svg>
        <span className="text-body-2 text-gray-60">
          실시간 수치와는 다소 차이가 있을 수 있습니다.
        </span>
      </footer>
    </div>
  );
};

export default AssetManagementDraggableTable;
