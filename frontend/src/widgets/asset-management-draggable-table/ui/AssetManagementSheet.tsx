"use client";

import Table from "@/shared/ui/table/Table";
import { FC, useMemo, useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { DatePicker, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import NumberInput from "@/shared/ui/NumberInput";
import { useAtom } from "jotai/index";
import { motion } from "framer-motion";
import { allField } from "@/widgets/asset-management-draggable-table/constants/allField";
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
import { ColumnType } from "@/features/assetManagement/consts/column-type";
import {
  StockAssetParentWithType,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import AccordionToggleButton from "@/shared/ui/AccordionToggleButton";
import SellBuyButton from "@/widgets/asset-management-draggable-table/ui/SellBuyButton";
import { isTempId } from "@/entities/assetManagement/utils/tempIdUtils";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
import { format } from "date-fns";
import AccountTypeCell from "@/widgets/asset-management-draggable-table/ui/AccountTypeCell";
import SellBuyToggleButton from "@/widgets/asset-management-draggable-table/ui/SellBuyToggleButton";
import { priceInputFields } from "@/widgets/asset-management-draggable-table/constants/priceInputFields";
import { exchange } from "@/shared/utils/number";

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
}) => {
  const [openedFields, setOpenedFields] = useState<string[]>([]);

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

  const tableData = useMemo(
    () =>
      data.stock_assets
        .map((stock) => [
          {
            ...stock.parent,
            id: stock.parent.종목명,
            type: ColumnType.Parent,
          } as StockAssetParentWithType,
          ...stock.sub.map(
            (sub) =>
              ({
                ...sub,
                type: ColumnType.Sub,
              }) as StockAssetSubWithType,
          ),
        ])
        .flat()
        .filter((stock) => {
          if (stock.type === ColumnType.Parent) return true;

          return (
            stock.type === ColumnType.Sub &&
            openedFields.includes(stock.종목명 as unknown as string)
          );
        })
        .map((stock) =>
          parseStockForMultipleCurrency(stock, { wonExchange, dollarExchange }),
        ),
    [data.stock_assets, dollarExchange, openedFields, wonExchange],
  );

  const receivedFields = data?.asset_fields;

  const errorInfo = useAtomValue(cellErrorAtom);

  const {
    addEmptyParentColumn,
    handleDeleteAssetStockSub,
    handleStockNameChange,
    handleAddEmptySubStock,
    handleValueChange,
    handleDeleteAssetStockParent,
  } = useHandleAssetStock({
    currencySetting,
    accessToken,
    itemNameList,
    tableData,
  });

  if (tableData.length === 0) {
    addEmptyParentColumn();
  }

  if (
    tableData.length > 0 &&
    tableData.every((stock) => !isTempId(stock.id + ""))
  ) {
    addEmptyParentColumn();
  }

  const { fields, handleReset, handleChange } = useHandleAssetStockField({
    fieldsList: {
      all: allField,
      received: receivedFields ?? [],
    },
    accessToken,
  });

  const { fieldSize, isFixed, resizeFieldSize, tableMinimumWidth } =
    useAssetManagementSheetWidth(
      fields.filter((field) => field.isChecked).map((field) => field.name) ??
        [],
    );

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
        dataset={tableData}
        headerBuilder={(key) => <AssetManagementSheetHeader field={key} />}
        errorInfo={errorInfo}
        cellBuilder={(key: (typeof allField)[number], data, id) => {
          const currentRow = tableData.find((stock) => stock.id === id);
          const type = currentRow?.type;

          const code = itemNameList.find(
            (item) => item.name_kr === currentRow?.종목명,
          )?.code;

          const isParent = type === ColumnType.Parent;
          const isKrCodeRegex = /^\d{6}$/;
          const isKrCode = isKrCodeRegex.test(code ?? "");

          const currentCurrency = isKrCode ? "KRW" : currencySetting;

          if (!currentRow?.id)
            throw new Error("currentRow 의 id 값이 정의되지 않았습니다.");

          let value = data;

          if (
            !isKrCode &&
            currentRow?.["주식통화"] !== "USD" &&
            currentCurrency === "USD" &&
            priceInputFields.includes(key)
          ) {
            value = exchange(value, dollarExchange);
          }

          if (
            !isKrCode &&
            currentRow?.["주식통화"] !== "KRW" &&
            currentCurrency === "KRW" &&
            priceInputFields.includes(key)
          ) {
            value = exchange(value, wonExchange);
          }

          if (priceInputFields.includes(key)) {
            value = ceil(value, currentCurrency === "KRW" ? 0 : 2);
          }

          switch (isParent && key) {
            case "종목명":
              return isTempId(currentRow?.id + "") ? (
                <ItemNameCell
                  defaultSelected={null}
                  onSelect={(item) => {
                    handleStockNameChange(id, item);
                  }}
                  selections={itemNameList}
                />
              ) : (
                <div className="flex h-full w-full flex-row items-center">
                  <AccordionToggleButton
                    onToggle={(open) => {
                      if (open) {
                        setOpenedFields((prev) => [...prev, data]);
                      } else {
                        setOpenedFields((prev) =>
                          prev.filter((field) => field !== data),
                        );
                      }
                    }}
                    value={openedFields.includes(data)}
                  />
                  <div className="flex w-full flex-row items-center justify-between px-2.5 py-[12.5]">
                    <div className="text-body-2 text-gray-90">{data}</div>
                    <SellBuyButton
                      type="button"
                      onClick={() =>
                        handleAddEmptySubStock(currentRow.종목명 as string)
                      }
                    />
                  </div>
                </div>
              );
            case "수량":
              return (
                <NumberInput
                  value={value}
                  placeholder={!value ? "0" : ""}
                  type="amount"
                  variants={"default"}
                  autoFill
                />
              );
            case "매매일자":
              return (
                <div className="pointer-events-none flex h-full w-full touch-none flex-row items-center justify-start bg-gray-5 px-[9px] text-gray-50">
                  <DatePicker
                    date={value ? new Date(value) : null}
                    onChange={() => {}}
                  />
                </div>
              );
            case "매매":
              return <div className="h-full w-full bg-gray-5" />;
            case "계좌종류":
              return <div className="h-full w-full bg-gray-5" />;
            case "현재가":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "배당금":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={
                    value === undefined
                      ? "자동 계산 필드입니다."
                      : value === 0
                        ? "배당금이 없는 종목이에요."
                        : ""
                  }
                  variants={
                    value === undefined
                      ? "gray-light"
                      : value === 0
                        ? "gray-dark"
                        : "default"
                  }
                  autoFill
                />
              );
            case "고가":
              return (
                <NumberInput
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "증권사":
              return <div className="h-full w-full bg-gray-5" />;
            case "저가":
              return (
                <NumberInput
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "시가":
              return (
                <NumberInput
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "수익률":
              return (
                <NumberInput
                  value={value ?? undefined}
                  placeholder="자동 계산 필드입니다."
                  type={fieldNumberType(key)}
                  variants={
                    value === null
                      ? "gray-light"
                      : value === undefined
                        ? "gray-light"
                        : value === 0
                          ? "default"
                          : value > 0
                            ? "increase"
                            : value < 0
                              ? "decrease"
                              : "default"
                  }
                  autoFill
                />
              );
            case "수익금":
              return (
                <NumberInput
                  value={value}
                  region={currentCurrency}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "거래금":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "거래가":
              return (
                <NumberInput
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "거래량":
              return (
                <NumberInput
                  type={fieldNumberType(key)}
                  placeholder={"0"}
                  variants="gray-light"
                  autoFill
                />
              );
          }

          switch (key) {
            case "종목명":
              return (
                <div className="ml-16 flex h-full w-full flex-row items-center border-l-[3px] border-l-gray-30 bg-gray-5 px-2.5 text-body-2 text-gray-90">
                  {value}
                </div>
              );
            case "수량":
              return (
                <NumberInput
                  value={value ?? 0}
                  onChange={(value) => {
                    if (value !== undefined) {
                      handleValueChange(key, +value, id as number);
                    }
                  }}
                  placeholder={!data ? "0" : ""}
                  type="amount"
                  variants={"default"}
                />
              );
            case "매매일자":
              return (
                <div className="flex h-full w-full flex-row items-center justify-start px-[9px]">
                  <DatePicker
                    date={value ? new Date(value) : null}
                    onChange={(date) => {
                      const formatedDate = format(date, "yyyy-MM-dd");
                      handleValueChange(key, formatedDate, id as number);
                    }}
                  />
                </div>
              );
            case "매매":
              return (
                <div className="h-fulㅇ flex w-full p-[9px]">
                  <SellBuyToggleButton
                    type={value}
                    onClick={(value) => {
                      handleValueChange(key, value, id as number);
                    }}
                  />
                </div>
              );
            case "계좌종류":
              return (
                <AccountTypeCell
                  selected={value}
                  onSelect={(name) =>
                    handleValueChange(key, name, id as number)
                  }
                  selections={accountList}
                />
              );
            case "현재가":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "배당금":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={
                    value === undefined || value === null
                      ? "자동 계산 필드입니다."
                      : value === 0
                        ? "배당금이 없는 종목이에요."
                        : ""
                  }
                  variants={
                    value === undefined || value === null
                      ? "gray-light"
                      : value === 0
                        ? "gray-dark"
                        : "default"
                  }
                  autoFill
                />
              );
            case "고가":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "증권사":
              return <div className="h-full w-full bg-gray-5" />;
            case "저가":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "시가":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "수익률":
              return (
                <NumberInput
                  value={value ?? undefined}
                  placeholder="자동 계산 필드입니다."
                  type={fieldNumberType(key)}
                  variants={
                    value === null
                      ? "gray-light"
                      : value === undefined
                        ? "gray-light"
                        : value === 0
                          ? "default"
                          : value > 0
                            ? "increase"
                            : value < 0
                              ? "decrease"
                              : "default"
                  }
                  autoFill
                />
              );
            case "수익금":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "거래금":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
            case "거래가":
              return (
                <NumberInput
                  value={value}
                  region={currentCurrency}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
                  onChange={(value) => {
                    handleValueChange(key, value, id as number);
                  }}
                />
              );
            case "거래량":
              return (
                <NumberInput
                  value={value}
                  type={fieldNumberType(key)}
                  region={currentCurrency}
                  placeholder={"자동 계산 필드입니다."}
                  autoFill
                  variants={!value ? "gray-light" : "default"}
                />
              );
          }
        }}
        tableWidth={tableMinimumWidth}
        fieldWidth={(key) => fieldSize[key]}
        onAddRow={addEmptyParentColumn}
        onDeleteRow={(id: number | string) => {
          if (typeof id === "number") {
            handleDeleteAssetStockSub(id);
          } else {
            handleDeleteAssetStockParent(id);
          }
        }}
        onReorder={() => handleChange}
        onReset={handleReset}
        onResize={resizeFieldSize}
      />
      <AssetManagementSheetFooter />
    </motion.div>
  );
};

// @ts-ignore
export default AssetManagementSheet;
