"use client";

import Table from "@/shared/ui/table/Table";
import { FC, useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import AccountTypeCell from "@/widgets/asset-management-draggable-table/ui/AccountTypeCell";
import { DatePicker, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import NumberInput from "@/shared/ui/NumberInput";
import { useAtom } from "jotai/index";
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
import { ColumnType } from "@/features/assetManagement/consts/column-type";
import { StockAssetParentWithType } from "@/widgets/asset-management-draggable-table/types/table";

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

  // TODO: parent 만 우선적으로 디스플레이 하기
  const tableData = data.stock_assets
    .map(
      (stock) =>
        ({
          ...stock.parent,
          id: stock.parent.종목명,
          type: ColumnType.Parent,
        }) as StockAssetParentWithType,
    )
    .flat()
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
                <ItemNameCell
                  selected={data}
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
                  value={data}
                  // onChange={(value) => handleValueChange(key, value, id)}
                  placeholder={!data ? "0" : ""}
                  type="amount"
                  variants={!data ? "gray-light" : "default"}
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
              return <div></div>;
            case "현재가":
              return (
                <NumberInput
                  value={data}
                  type={fieldNumberType(key)}
                  placeholder={"₩ 0"}
                  variants="default"
                  autoFill
                />
              );
            case "배당금":
              return <div>배당금</div>;
            case "고가":
              return <div>고가</div>;
            case "증권사":
              return <div>증권사</div>;
            case "저가":
              return <div>저가</div>;
            case "시가":
              return <div>시가</div>;
            case "수익률":
              return <div>수익률</div>;
            case "수익금":
              return <div>수익금</div>;
            case "거래금":
              return <div>거래금</div>;
            case "거래가":
              return <div>거래가</div>;
            case "거래량":
              return <div>거래량</div>;
          }

          if (isParent && key === "매매") {
            // TODO: 매매 컴포넌트 채워넣기
            return;
          }

          const code = itemNameList.find(
            (item) => item.name_kr === currentRow?.종목명,
          )?.code;

          const isKrCodeRegex = /^\d{6}$/;
          const isKrCode = isKrCodeRegex.test(code ?? "");
          const currentCurrency = isKrCode ? "KRW" : currencySetting;

          // TODO: parent 행에 대한 작업 먼저 처리 해야함. 어떤 항목은 수정 가능하고 어떤 항목은 disabled 되어야 하는지.
          // TODO: 이외에 추가적으로 보여져야 하는 필드들에 대해 처리 해야함. 매매 필드가 그러함.

          if (key === "계좌종류") {
            return (
              <AccountTypeCell
                selected={data}
                // onSelect={(name) => handleValueChange(key, name, id)}
                onSelect={() => {}}
                selections={accountList}
              />
            );
          }

          if (key === "증권사") {
            return (
              <AccountTypeCell
                // onSelect={(name) => handleValueChange(key, name, id)}
                onSelect={() => {}}
                selections={brokerList}
                selected={data}
                icon
              />
            );
          }

          if (key === "배당금") {
            let value = data;
            // const originCurrency = currentRow?.주식통화 ?? "KRW";
            const originCurrency = "KRW";

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
          }

          // if (key === "") {
          //   let value = data;
          //   // const originCurrency = currentRow?.주식통화 ?? "KRW";
          //   const originCurrency = "KRW";
          //
          //   if (originCurrency !== currentCurrency && data) {
          //     value = data?.changedValue;
          //   }
          //
          //   return (
          //     <NumberInput
          //       onChange={(value) => {
          //         // handleValueChange(key, value, id, currentCurrency);
          //       }}
          //       value={value}
          //       type={fieldNumberType(key)}
          //       region={currentCurrency}
          //       placeholder={currentCurrency === "KRW" ? "₩ 0" : "$ 0"}
          //       variants="default"
          //     />
          //   );
          // }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Rate
          ) {
            let value = data;

            if (isNumber(data)) {
              value = data;
            }

            return (
              <NumberInput
                value={value ?? undefined}
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
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Amount
          ) {
            let value = data;

            if (isNumber(data)) {
              value = ceil(data);
            }

            return (
              <NumberInput
                value={value}
                placeholder="자동 계산 필드입니다."
                type={fieldNumberType(key)}
                autoFill
                variants={!data ? "gray-light" : "default"}
              />
            );
          }

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Price
          ) {
            let value = data;
            // const originCurrency = currentRow?.주식통화 ?? "KRW";
            const originCurrency = "KRW";

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
                variants={!data ? "gray-light" : "default"}
              />
            );
          }

          return null;
        }}
        tableWidth={tableMinimumWidth}
        fieldWidth={(key) => fieldSize[key]}
        // TODO: 수정 해야함.
        // TODO: 타입 시스템 및 테이블 인터페이스 점검하기
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
