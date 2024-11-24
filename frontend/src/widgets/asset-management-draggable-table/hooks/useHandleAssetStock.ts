import {
  AssetManagementResponse,
  StockAsset,
} from "@/widgets/asset-management-draggable-table/types/table";
import { keyStore } from "@/shared/lib/query-keys";
import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";
import { useQueryClient } from "@tanstack/react-query";
import { usePostAssetStock } from "@/entities/assetManagement/queries/usePostAssetStock";
import { usePatchAssetStock } from "@/entities/assetManagement/queries/usePatchAssetStock";
import { useDeleteAssetStock } from "@/entities/assetManagement/queries/useDeleteAssetStock";
import { useSetAtom } from "jotai/index";
import { loginModalAtom } from "@/features";
import { essentialFields } from "@/widgets/asset-management-draggable-table/constants/essentialFields";
import { PostAssetStockRequestBody } from "@/entities/assetManagement/apis/postAssetStock";
import { PatchAssetStockRequestBody } from "@/entities/assetManagement/apis/patchAssetStock";
import { extractNumber, isNumber } from "@/shared/utils/number";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

const changeFieldToForm = {
  구매일자: "buy_date",
  수량: "quantity",
  계좌종류: "account_type",
  증권사: "investment_bank",
  매입가: "purchase_price",
};

interface UseHandleAssetStockParams {
  currencySetting: CurrencyType;
  itemNameList: ItemName[];
  accessToken: string | null;
  tableData: StockAsset[];
}

export const useHandleAssetStock = ({
  accessToken,
  currencySetting,
  itemNameList,
  tableData,
}: UseHandleAssetStockParams) => {
  const { mutate: originCreateAssetStock } = usePostAssetStock();
  const { mutate: originUpdateAssetStock } = usePatchAssetStock();
  const { mutate: deleteAssetStock } = useDeleteAssetStock();

  const updateAssetStock = useDebounce(originUpdateAssetStock, 500);
  const createAssetStock = useDebounce(originCreateAssetStock, 500);

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);
  const setErrorInfo = useSetAtom(cellErrorAtom);

  const queryClient = useQueryClient();

  const handleAddRow = () => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }
    originCreateAssetStock({ accessToken });
  };

  const handleDeleteRow = (id: number) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    deleteAssetStock({ accessToken: accessToken, id });

    queryClient.setQueryData<AssetManagementResponse>(
      keyStore.assetStock.getSummary.queryKey,
      () => {
        const prev = queryClient.getQueryData<AssetManagementResponse>(
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

  return {
    handleAddRow,
    handleDeleteRow,
    handleValueChange,
  };
};
