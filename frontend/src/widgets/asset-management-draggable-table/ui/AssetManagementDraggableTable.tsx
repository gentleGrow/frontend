"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import {
  AssetStock,
  StockAsset,
} from "@/widgets/asset-management-draggable-table/types/table";
import { FC, useEffect, useState } from "react";
import { useGetAssetStocks } from "@/widgets/asset-management-draggable-table/quries/useGetAssetStocks";
import ItemNameCell from "@/widgets/asset-management-draggable-table/ui/ItemNameCell";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import AccountTypeCell from "@/widgets/asset-management-draggable-table/ui/AccountTypeCell";
import { DatePicker, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import { format } from "date-fns";
import NumberInput from "@/shared/ui/NumberInput";
import { useSetAtom } from "jotai/index";
import { loginModalAtom } from "@/features";
import SortingButton from "@/widgets/asset-management-draggable-table/ui/SortingButton";
import { motion } from "framer-motion";
import { usePostAssetStock } from "@/entities/assetManagement/queries/usePostAssetStock";
import { usePatchAssetStock } from "@/entities/assetManagement/queries/usePatchAssetStock";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { PostAssetStockRequestBody } from "@/entities/assetManagement/apis/postAssetStock";
import { PatchAssetStockRequestBody } from "@/entities/assetManagement/apis/patchAssetStock";
import { allField } from "@/widgets/asset-management-draggable-table/constants/allField";
import { usePutAssetField } from "@/entities/assetManagement/queries/usePutAssetField";
import { useDeleteAssetStock } from "@/entities/assetManagement/queries/useDeleteAssetStock";
import Tooltip from "@/shared/ui/Tooltip";
import Image from "next/image";
import { extractNumber, isNumber } from "@/shared/utils/number";
import { ceil } from "es-toolkit/compat";
import { cloneDeep } from "es-toolkit";
import { useAtomValue } from "jotai";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

const filedWidth = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

let NewFieldId = -1;

const essentialFields = ["종목명", "수량", "구매일자"];

const priceInputFields = [
  "현재가",
  "배당금",
  "고가",
  "저가",
  "시가",
  "매입금",
  "매입가",
  "수익금",
];

const fieldIsRequired = (field: string) => essentialFields.includes(field);

const numberFields = [
  "수량",
  "현재가",
  "배당금",
  "고가",
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

const changeFieldToForm = {
  구매일자: "buy_date",
  수량: "quantity",
  계좌종류: "account_type",
  증권사: "investment_bank",
  매입가: "purchase_price",
};

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

const AssetManagementDraggableTable: FC<AssetManagementDraggableTableProps> = ({
  accessToken,
  itemNameList,
  accountList,
  brokerList,
}) => {
  const [currentSorting, setCurrentSorting] = useState<"asc" | "desc">("asc");
  const [sortingField, setSortingField] = useState<string | null>(null);

  const [currencySetting, setCurrencySetting] = useState<"KRW" | "USD">("KRW");

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);

  const { data } = useGetAssetStocks(accessToken, {
    sortBy: sortingField,
    sortOrder: currentSorting,
    type: getSortType(sortingField),
    itemList: itemNameList,
  });
  const errorInfo = useAtomValue(cellErrorAtom);
  const setErrorInfo = useSetAtom(cellErrorAtom);

  useEffect(() => {
    setErrorInfo(null);
  }, [setErrorInfo]);

  const { mutate: originCreateAssetStock } = usePostAssetStock();
  const { mutate: originUpdateAssetStock } = usePatchAssetStock();
  const { mutate: updateAssetField } = usePutAssetField();
  const { mutate: deleteAssetStock } = useDeleteAssetStock();

  const updateAssetStock = useDebounce(originUpdateAssetStock, 500);
  const createAssetStock = useDebounce(originCreateAssetStock, 500);

  const queryClient = useQueryClient();

  const receivedFields = data?.asset_fields;

  const lastField = allField.filter((field) => !receivedFields.includes(field));

  const [fields, setFields] = useState(
    [...receivedFields, ...lastField].map((field) =>
      fieldIemFactory(field, data?.asset_fields),
    ) ?? [],
  );

  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableData = data.stock_assets.map((stock) => {
    const newStock = cloneDeep(stock);
    priceInputFields.forEach((field) => {
      const currentCurrency = stock.주식통화;
      if (!newStock[field]) return;
      if (currentCurrency === "USD") {
        if (typeof newStock[field].value === "number") {
          newStock[field].changedValue = ceil(
            newStock[field].value * data.won_exchange,
          );
        }
      } else if (currentCurrency === "KRW") {
        if (typeof newStock[field].value === "number") {
          newStock[field].changedValue = ceil(
            newStock[field].value * data.dollar_exchange,
            2,
          );
        }
      }
    });

    return {
      ...newStock,
    };
  });

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
        <span className="flex flex-row gap-1">
          {key}
          {essentialFields.includes(key) && (
            <span className="text-green-60">*</span>
          )}
          {key === "수익률" && (
            <Tooltip>
              <Tooltip.Trigger>
                <Image
                  src={"/images/tip.svg"}
                  width={16}
                  height={16}
                  alt="tip"
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                주식을 매수한 평균 매입가입니다. 주가의 변동으로 처음 매입했던
                가격과 다른 가격으로 매수될 경우 평균을 내서 해당 보유 주식의
                전체 매수 가격을 표기하는 방법이에요.
              </Tooltip.Content>
            </Tooltip>
          )}
        </span>
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

  const handleDeleteRow = (id: number) => {
    if (accessToken) {
      deleteAssetStock({ accessToken: accessToken, id });
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
          stock_assets: prev.stock_assets.filter((stock) => stock.id !== id),
        };
      },
    );
  };

  const handleAddRow = () => {
    queryClient.setQueryData<AssetStock>(
      keyStore.assetStock.getSummary.queryKey,
      // @ts-ignore
      () => {
        const prev = queryClient.getQueryData<AssetStock>(
          keyStore.assetStock.getSummary.queryKey,
        );
        if (!prev) return;
        return {
          ...prev,
          stock_assets: [
            ...prev.stock_assets,
            {
              id: NewFieldId--,
              주식통화: currencySetting,
              종목명: {
                isRequired: true,
                value: undefined,
              },
              수량: {
                isRequired: true,
                value: undefined,
              },
              구매일자: {
                isRequired: true,
                value: undefined,
              },
              증권사: {
                isRequired: true,
                value: undefined,
              },
              계좌종류: {
                isRequired: true,
                value: undefined,
              },
              수익률: {
                isRequired: false,
                value: undefined,
              },
              시가: {
                isRequired: false,
                value: undefined,
              },
              고가: {
                isRequired: false,
                value: undefined,
              },
              저가: {
                isRequired: false,
                value: undefined,
              },
              거래량: {
                isRequired: false,
                value: undefined,
              },
              배당금: {
                isRequired: false,
                value: undefined,
              },
              매입금: {
                isRequired: false,
                value: undefined,
              },
              현재가: {
                isRequired: false,
                value: undefined,
              },
              수익금: {
                isRequired: false,
                value: undefined,
              },
              매입가: {
                isRequired: false,
                value: undefined,
              },
            },
          ],
        };
      },
    );
  };

  const handleValueChange = (
    key: string,
    value: any,
    id: number,
    region?: "KRW" | "USD",
  ) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    setErrorInfo(null);

    if (id < 0) {
      const targetRow = tableData.find((stock) => stock.id === id);

      if (!targetRow) return;

      const cloneRow = JSON.parse(JSON.stringify(targetRow));

      cloneRow[key].value = value;

      const isAllFilled = essentialFields.every((field) => {
        if (cloneRow?.[field].value === undefined) {
          return key === field && value !== undefined;
        }
        return true;
      });

      if (isAllFilled) {
        const name = cloneRow?.종목명.value;
        const code = itemNameList.find((item) => item.name_kr === name)?.code;

        if (!code) return;

        const body: PostAssetStockRequestBody = {
          account_type: (cloneRow?.계좌종류.value ?? null) as string | null,
          buy_date: cloneRow?.구매일자.value as string,
          investment_bank: (cloneRow?.증권사.value ?? null) as string | null,
          purchase_currency_type: currencySetting,
          purchase_price: (cloneRow?.매입가.value ?? null) as number | null,
          quantity: cloneRow?.수량.value as number,
          stock_code: code as string,
          tempId: id,
        };

        createAssetStock({ accessToken: accessToken as string, body });
      }
    } else {
      if (key === "종목명") {
        const name = value;
        const target = itemNameList.find((item) => item.name_kr === name);
        const code = target?.code;

        if (!code) return;

        const body: PatchAssetStockRequestBody = {
          id: id as number,
          account_type: null,
          buy_date: null,
          investment_bank: null,
          purchase_currency_type: null,
          purchase_price: null,
          quantity: null,
          stock_code: code as string,
        };

        updateAssetStock({
          accessToken: accessToken as string,
          body,
        });
      } else if (key === "매입가") {
        let price = Number(extractNumber(value));

        if (isNumber(price)) {
          const body: PatchAssetStockRequestBody = {
            id: id as number,
            buy_date: null,
            account_type: null,
            investment_bank: null,
            purchase_currency_type: region ?? null,
            purchase_price: price,
            quantity: null,
            stock_code: null,
          };

          if (isNumber(price)) {
            updateAssetStock({
              accessToken: accessToken as string,
              body,
            });
          }
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
                    주식통화: currencySetting,
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
        return;
      } else {
        const body: PatchAssetStockRequestBody = {
          id: id as number,
          buy_date: null,
          account_type: null,
          investment_bank: null,
          purchase_currency_type: null,
          purchase_price: null,
          quantity: null,
          stock_code: null,
        };

        body[changeFieldToForm[key]] = value;

        updateAssetStock({
          accessToken: accessToken as string,
          body,
        });
      }
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
                주식통화: region ?? stock.주식통화,
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

  const handleReorder = (
    newFields: {
      isRequired: boolean;
      isChecked: boolean;
      name: string;
    }[],
  ) => {
    setFields(newFields);
    const valueToUpdate = newFields
      .filter((field) => field.isChecked || field.isRequired)
      .map((field) => field.name);

    if (accessToken) {
      updateAssetField({ accessToken, newFields: valueToUpdate });
    }
  };

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
        headerBuilder={headerBuilder}
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

          if (
            autoFilledField.includes(key) &&
            fieldNumberType(key) === NumberFieldType.Price
          ) {
            let value = data?.value;
            const originCurrency = currentRow?.주식통화 ?? "KRW";

            if (originCurrency !== currentCurrency && data?.value) {
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

          return;
        }}
        tableWidth={tableMinimumWidth}
        fieldWidth={(key) => fieldSize[key]}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onReorder={handleReorder}
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
    </motion.div>
  );
};

// @ts-ignore
export default AssetManagementDraggableTable;
