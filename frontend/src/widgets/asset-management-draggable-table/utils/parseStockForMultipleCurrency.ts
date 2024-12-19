import { cloneDeep } from "es-toolkit";
import {
  StockAssetParentWithType,
  StockAssetSub,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import { ColumnType } from "@/features/assetManagement/consts/column-type";

export const isSub = (
  stock: StockAssetSubWithType | StockAssetParentWithType,
): stock is StockAssetSub & { type: typeof ColumnType.Sub } => {
  return stock.type === ColumnType.Sub;
};

export const parseStockForMultipleCurrency = (
  stock: StockAssetParentWithType | StockAssetSubWithType,
  {
    // wonExchange,
    // dollarExchange,
  }: { wonExchange: number; dollarExchange: number },
) => {
  if (!isSub(stock)) {
    const newParentStock = cloneDeep(stock);
    // TODO: 흠... 서브 행이 원화, 환화로 입력 가능한데, 부모 행의 값은 무조건 원화로만 오는지? 수정 되어야 함.
    return stock;
  }

  return stock;

  // const newStock = cloneDeep(stock);
  // priceInputFields.forEach((field) => {
  //   const currentCurrency = stock.주식통화;
  //   if (!newStock[field]) return;
  //   if (
  //     currentCurrency === CurrencyType.USD &&
  //     typeof newStock[field].value === "number"
  //   ) {
  //     newStock[field].changedValue = ceil(
  //       newStock[field].value * wonExchange,
  //       precisionByCurrency[CurrencyType.KRW],
  //     );
  //   } else if (
  //     currentCurrency === CurrencyType.KRW &&
  //     typeof newStock[field].value === "number"
  //   ) {
  //     newStock[field].changedValue = ceil(
  //       newStock[field].value * dollarExchange,
  //       precisionByCurrency[CurrencyType.USD],
  //     );
  //   }
  // });

  // return {
  //   ...newStock,
  // };
};
