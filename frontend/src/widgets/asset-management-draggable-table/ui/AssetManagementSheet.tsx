"use client";

import Table from "@/shared/ui/table/Table";
import { FC, useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
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
  AssetValue,
  StockAssetParentWithType,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import AccordionToggleButton from "@/shared/ui/AccordionToggleButton";
import SellBuyButton from "@/widgets/asset-management-draggable-table/ui/SellBuyButton";

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

  // TODO: parent 만 우선적으로 디스플레이 하기
  const tableData = data.stock_assets
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

      console.log(stock);

      return (
        stock.type === ColumnType.Sub &&
        openedFields.includes(
          (stock.종목명 as unknown as AssetValue<string>).value,
        )
      );
    })
    .map((stock) =>
      parseStockForMultipleCurrency(stock, { wonExchange, dollarExchange }),
    );

  const receivedFields = data?.asset_fields;

  const errorInfo = useAtomValue(cellErrorAtom);

  const { handleAddRow, handleDeleteRow, handleValueChange } =
    useHandleAssetStock({
      currencySetting,
      accessToken,
      itemNameList,
      tableData,
    });
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
          const isParent = type === ColumnType.Parent;

          switch (isParent && key) {
            case "종목명":
              return (
                <div className="flex h-full w-full flex-row items-center">
                  <AccordionToggleButton
                    onToggle={(changedValue) => {
                      if (changedValue) {
                        console.log(changedValue);
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
                    <SellBuyButton type="button" onClick={() => {}} />
                  </div>
                </div>
              );
            case "수량":
              return (
                <NumberInput
                  value={data}
                  // onChange={(value) => handleValueChange(key, value, id)}
                  placeholder={!data ? "0" : ""}
                  type="amount"
                  variants={"default"}
                  autoFill
                />
              );
            case "매매일자":
              return (
                <div className="pointer-events-none flex h-full w-full touch-none flex-row items-center justify-start bg-gray-5 px-[9px] text-gray-50">
                  <DatePicker
                    date={data ? new Date(data) : null}
                    onChange={(date) => {
                      // const formatedDate = format(date, "yyyy-MM-dd");
                      // handleValueChange(key, formatedDate, id);
                    }}
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
                  value={ceil(data ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "배당금":
              let value = data;
              // const originCurrency = currentRow?.주식통화 ?? "KRW";
              // const originCurrency = "KRW";
              //
              // if (originCurrency !== currentCurrency) {
              //   value = data?.changedValue;
              // } else {
              //   if (currentCurrency === "KRW") {
              //     value = ceil(value);
              //   } else {
              //     value = ceil(value, 2);
              //   }
              // }

              return (
                <NumberInput
                  value={ceil(value) + ""}
                  type={fieldNumberType(key)}
                  region={"KRW"}
                  placeholder={
                    data === undefined
                      ? "자동 계산 필드입니다."
                      : data === 0
                        ? "배당금이 없는 종목이에요."
                        : ""
                  }
                  variants={
                    data === undefined
                      ? "gray-light"
                      : data === 0
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
                  value={data ?? undefined}
                  placeholder="자동 계산 필드입니다."
                  type={fieldNumberType(key)}
                  variants={
                    data === null
                      ? "gray-light"
                      : data === undefined
                        ? "gray-light"
                        : data === 0
                          ? "default"
                          : data > 0
                            ? "increase"
                            : data < 0
                              ? "decrease"
                              : "default"
                  }
                  autoFill
                />
              );
            case "수익금":
              return (
                <NumberInput
                  value={ceil(data ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
                  autoFill
                />
              );
            case "거래금":
              return (
                <NumberInput
                  value={ceil(data ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
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

          const code = itemNameList.find(
            (item) => item.name_kr === currentRow?.종목명,
          )?.code;

          const isKrCodeRegex = /^\d{6}$/;
          const isKrCode = isKrCodeRegex.test(code ?? "");
          const currentCurrency = isKrCode ? "KRW" : currencySetting;

          // TODO: 지금은 UI만 그리게 해둔 상태임.
          // TODO: 추후 제대로 동작할 수 있게 기능 보충 해야함.
          switch (key) {
            case "종목명":
              return (
                <ItemNameCell
                  selected={data?.value}
                  onSelect={
                    // (item) => handleValueChange(key, item.name_kr, id)
                    () => {}
                  }
                  selections={itemNameList}
                  readonly
                />
              );
            case "수량":
              return (
                <NumberInput
                  value={data?.value}
                  // onChange={(value) => handleValueChange(key, value, id)}
                  placeholder={!data ? "0" : ""}
                  type="amount"
                  variants={"default"}
                  autoFill
                />
              );
            case "매매일자":
              return (
                <div className="pointer-events-none flex h-full w-full touch-none flex-row items-center justify-start bg-gray-5 px-[9px] text-gray-50">
                  <DatePicker
                    date={data?.value ? new Date(data.value) : null}
                    onChange={(date) => {
                      // const formatedDate = format(date, "yyyy-MM-dd");
                      // handleValueChange(key, formatedDate, id);
                    }}
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
                  value={ceil(data?.value ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="gray-light"
                  autoFill
                />
              );
            case "배당금":
              let value = data;
              // const originCurrency = currentRow?.주식통화 ?? "KRW";
              // const originCurrency = "KRW";
              //
              // if (originCurrency !== currentCurrency) {
              //   value = data?.changedValue;
              // } else {
              //   if (currentCurrency === "KRW") {
              //     value = ceil(value);
              //   } else {
              //     value = ceil(value, 2);
              //   }
              // }

              return (
                <NumberInput
                  value={ceil(value?.value) + ""}
                  type={fieldNumberType(key)}
                  region={"KRW"}
                  placeholder={
                    data === undefined
                      ? "자동 계산 필드입니다."
                      : data === 0
                        ? "배당금이 없는 종목이에요."
                        : ""
                  }
                  variants={
                    data === undefined
                      ? "gray-light"
                      : data === 0
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
                  value={data?.value ?? undefined}
                  placeholder="자동 계산 필드입니다."
                  type={fieldNumberType(key)}
                  variants={
                    data?.value === null
                      ? "gray-light"
                      : data?.value === undefined
                        ? "gray-light"
                        : data?.value === 0
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
            case "수익금":
              return (
                <NumberInput
                  value={ceil(data?.value ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
                  autoFill
                />
              );
            case "거래금":
              return (
                <NumberInput
                  value={ceil(data?.value ?? 0) + ""}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
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
        }}
        tableWidth={tableMinimumWidth}
        fieldWidth={(key) => fieldSize[key]}
        onAddRow={() => handleAddRow("")}
        onDeleteRow={handleDeleteRow}
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
