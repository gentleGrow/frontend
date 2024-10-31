"use client";

import Table from "@/shared/ui/table/Table";
import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";
import { FC, useEffect, useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import AccountTypeCell from "@/widgets/asset-management-draggable-table/ui/AccountTypeCell";
import { DatePicker, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import { format } from "date-fns";
import NumberInput from "@/shared/ui/NumberInput";
import { useAtom, useSetAtom } from "jotai/index";
import { motion } from "framer-motion";
import { allField } from "@/widgets/asset-management-draggable-table/constants/allField";
import { isNumber } from "@/shared/utils/number";
import { ceil } from "es-toolkit/compat";
import { useAtomValue } from "jotai";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import AssetManagementSheetFooter from "@/widgets/asset-management-draggable-table/ui/AssetManagementSheetFooter";
import { useHandleAssetStockField } from "@/widgets/asset-management-draggable-table/hooks/useHandleAssetStockField";
import { parseStockForMultipleCurrency } from "@/widgets/asset-management-draggable-table/utils/parseStockForMultipleCurrency";
import { numberFields } from "@/widgets/asset-management-draggable-table/constants/numberFields";
import { currentSortingTypeAtom } from "@/widgets/asset-management-draggable-table/atoms/currentSortingTypeAtom";
import { sortingFieldAtom } from "@/widgets/asset-management-draggable-table/atoms/sortingFieldAtom";
import AssetManagementSheetHeader from "@/widgets/asset-management-draggable-table/ui/AssetManagementSheetHeader";
import { useAssetManagementSheetWidth } from "@/widgets/asset-management-draggable-table/hooks/useAssetManagementSheetWidth";
import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";
import { useHandleAssetStock } from "@/widgets/asset-management-draggable-table/hooks/useHandleAssetStock";
import { useInitializeAtoms } from "@/widgets/asset-management-draggable-table/atoms/useInitializeAtoms";

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

interface AssetManagementDraggableTableProps {
  accessToken: string | null;
  itemNameList: ItemName[];
  brokerList: string[];
  accountList: string[];
}

const defaultFields = [
  {
    isRequired: true,
    isChecked: true,
    name: "종목명",
  },
  {
    isRequired: true,
    isChecked: true,
    name: "수량",
  },
  {
    isRequired: true,
    isChecked: true,
    name: "구매일자",
  },
];

const getSortType = (field: string | null): "date" | "number" | "string" => {
  if (field === null) return "string";

  if (field === "구매일자") {
    return "date";
  }

  if (numberFields.includes(field)) {
    return "number";
  }

  return "string";
};

const AssetManagementSheet: FC<AssetManagementDraggableTableProps> = ({
  accessToken,
  itemNameList,
  accountList,
  brokerList,
}) => {
  const [currentSorting, setCurrentSorting] = useAtom(currentSortingTypeAtom);
  const [sortingField, setSortingField] = useAtom(sortingFieldAtom);

  useInitializeAtoms();

  const [currencySetting, setCurrencySetting] = useState<CurrencyType>(
    CurrencyType.KRW,
  );

  const { data } = useGetAssetStocks(accessToken, {
    sortBy: sortingField,
    sortOrder: currentSorting,
    type: getSortType(sortingField),
    itemList: itemNameList,
  });
  const dollarExchange = data.dollar_exchange ?? 0;
  const wonExchange = data.won_exchange ?? 0;

  const tableData = data.stock_assets.map((stock) =>
    parseStockForMultipleCurrency(stock, { wonExchange, dollarExchange }),
  );
  const receivedFields = data?.asset_fields;

  const errorInfo = useAtomValue(cellErrorAtom);
  const setErrorInfo = useSetAtom(cellErrorAtom);

  useEffect(() => {
    setErrorInfo(null);
  }, [setErrorInfo]);

  const { handleAddRow, handleDeleteRow, handleValueChange } =
    useHandleAssetStock({
      currencySetting,
      accessToken,
      itemNameList,
      tableData,
    });
  const { fields, handleReset, handleReorder } = useHandleAssetStockField({
    fieldsList: {
      all: allField,
      received: receivedFields ?? [],
    },
    accessToken,
  });

  const { fieldSize, tableMinimumWidth, isFixed, resizeFieldSize } =
    useAssetManagementSheetWidth();

  const handleCurrencyChange = (currency: "KRW" | "USD") => {
    setCurrencySetting(currency);
  };

  return (
    <motion.div
      className="flex flex-col gap-3 mobile:px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
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
                onClick={() => handleCurrencyChange("KRW")}
                isSelected={currencySetting === "KRW"}
              >
                ₩
              </SegmentedButton>
              <SegmentedButton
                onClick={() => handleCurrencyChange("USD")}
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
        fields={fields.length === 0 ? defaultFields : fields}
        dataset={tableData as StockAsset[]}
        headerBuilder={(key) => <AssetManagementSheetHeader field={key} />}
        errorInfo={errorInfo}
        cellBuilder={(key, data, id) => {
          const currentRow = tableData.find((stock) => stock.id === id);

          const code = itemNameList.find(
            (item) => item.name_kr === currentRow?.종목명.value,
          )?.code;

          const isKrCodeRegex = /^\d{6}$/;
          const isKrCode = isKrCodeRegex.test(code ?? "");
          const currentCurrency = isKrCode ? "KRW" : currencySetting;

          if (key === "종목명") {
            return (
              <ItemNameCell
                selected={data?.value}
                onSelect={(item) => handleValueChange(key, item.name_kr, id)}
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
              <div className="flex h-full w-full flex-row items-center justify-start px-[9px]">
                <DatePicker
                  date={data?.value ? new Date(data.value) : null}
                  onChange={(date) => {
                    const formatedDate = format(date, "yyyy-MM-dd");
                    handleValueChange(key, formatedDate, id);
                  }}
                />
              </div>
            );
          }

          if (key === "배당금") {
            let value = data?.value;
            const originCurrency = currentRow?.주식통화 ?? "KRW";

            if (originCurrency !== currentCurrency) {
              value = data?.changedValue;
            } else {
              if (currentCurrency === "KRW") {
                value = ceil(value);
              } else {
                value = ceil(value, 2);
              }
            }

            return (
              <NumberInput
                value={value}
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
                onChange={(value) => handleValueChange(key, value, id)}
                placeholder=""
                type="amount"
                variants="default"
              />
            );
          }

          if (key === "매입가") {
            let value = data?.value;
            const originCurrency = currentRow?.주식통화 ?? "KRW";

            if (originCurrency !== currentCurrency && data?.value) {
              value = data?.changedValue;
            }

            return (
              <NumberInput
                onChange={(value) => {
                  handleValueChange(key, value, id, currentCurrency);
                }}
                value={value}
                type={fieldNumberType(key)}
                region={currentCurrency}
                placeholder={currentCurrency === "KRW" ? "₩ 0" : "$ 0"}
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Rate
          ) {
            let value = data?.value;

            if (isNumber(data?.value)) {
              value = data?.value;
            }

            return (
              <NumberInput
                value={value ?? undefined}
                placeholder="자동 계산 필드입니다."
                type={fieldNumberType(key)}
                variants={
                  data?.value === null
                    ? "gray-light"
                    : data.value === undefined
                      ? "gray-light"
                      : data.value === 0
                        ? "default"
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
            let value = data?.value;

            if (isNumber(data?.value)) {
              value = ceil(data?.value);
            }

            return (
              <NumberInput
                value={value}
                placeholder="자동 계산 필드입니다."
                type={fieldNumberType(key)}
                autoFill
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Price
          ) {
            let value = data?.value;
            const originCurrency = currentRow?.주식통화 ?? "KRW";

            if (originCurrency !== currentCurrency && value) {
              value = data?.changedValue;
            } else {
              if (currentCurrency === "KRW") {
                value = ceil(value);
              } else {
                value = ceil(value, 2);
              }
            }

            return (
              <NumberInput
                value={value}
                type={fieldNumberType(key)}
                region={currentCurrency}
                placeholder={"자동 계산 필드입니다."}
                autoFill
                variants={!data?.value ? "gray-light" : "default"}
              />
            );
          }

          return null;
        }}
        tableWidth={tableMinimumWidth}
        fieldWidth={(key) => fieldSize[key]}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onReorder={handleReorder}
        onReset={handleReset}
        onResize={resizeFieldSize}
      />
      <AssetManagementSheetFooter />
    </motion.div>
  );
};

// @ts-ignore
export default AssetManagementSheet;
