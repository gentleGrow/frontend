import {
  AssetManagementResponse,
  StockAssetParentWithType,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import { keyStore } from "@/shared/lib/query-keys";
import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";
import { useQueryClient } from "@tanstack/react-query";
import { usePostAssetStockParent } from "@/entities/assetManagement/queries/usePostAssetStockParent";
import { useDeleteAssetStockSub } from "@/entities/assetManagement/queries/useDeleteAssetStockSub";
import { useSetAtom } from "jotai/index";
import { loginModalAtom } from "@/features";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import { createEmptyStockAsset } from "@/entities/assetManagement/utils/factory";
import { usePostAssetStockSub } from "@/entities/assetManagement/queries/usePostAssetStockSub";
import { isTempId } from "@/entities/assetManagement/utils/tempIdUtils";
import { useDeleteAssetStockParent } from "@/entities/assetManagement/queries/useDeleteAssetStockParent";

let tempId = -1;

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
  tableData: (StockAssetParentWithType | StockAssetSubWithType)[];
}

export const useHandleAssetStock = ({
  accessToken,
  currencySetting,
  itemNameList,
  tableData,
}: UseHandleAssetStockParams) => {
  const { mutate: originCreateAssetStockParent } =
    usePostAssetStockParent(itemNameList);
  const { mutate: originPostAssetStockSub } = usePostAssetStockSub();
  const { mutate: deleteAssetStockSub } = useDeleteAssetStockSub();
  const { mutate: deleteAssetStockParent } = useDeleteAssetStockParent();

  const createAssetStockParent = useDebounce(originCreateAssetStockParent, 500);

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);
  const setErrorInfo = useSetAtom(cellErrorAtom);

  const queryClient = useQueryClient();

  const addEmptyParentColumn = () => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    const emptyStock = createEmptyStockAsset();

    queryClient.setQueryData(keyStore.assetStock.getSummary.queryKey, () => {
      const prev = queryClient.getQueryData<AssetManagementResponse>(
        keyStore.assetStock.getSummary.queryKey,
      );
      if (!prev) return;

      const newStock = [...prev.stock_assets, emptyStock];

      return {
        ...prev,
        stock_assets: newStock,
      };
    });
  };

  const handleAddEmptySubStock = (stockName: string) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    const stockCode = itemNameList.find(
      (item) => item.name_kr === stockName,
    )?.code;

    if (!stockCode) return;

    originPostAssetStockSub({
      accessToken,
      body: {
        stock_code: stockCode,
      },
    });
  };

  const handleDeleteAssetStockSub = (id: number) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    deleteAssetStockSub({ accessToken: accessToken, id });
  };

  const handleValueChange = (key: string, value: unknown, id: number) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    queryClient.setQueryData<AssetManagementResponse>(
      keyStore.assetStock.getSummary.queryKey,
      () => {
        const prev = queryClient.getQueryData<AssetManagementResponse>(
          keyStore.assetStock.getSummary.queryKey,
        );

        if (!prev) return;

        const newStock = prev.stock_assets.map((stock) => {
          return {
            ...stock,
            sub: stock.sub.map((sub) => {
              if (sub.id === id) {
                return {
                  ...sub,
                  [key]: {
                    ...sub[key],
                    value,
                  },
                };
              }
              return sub;
            }),
          };
        });

        return {
          ...prev,
          stock_assets: newStock,
        };
      },
    );

    // TODO: 공용 자산 시트 데이터 수정 로직을 생성해 노출 시킨다.
    setErrorInfo(null);
  };

  const handleDeleteAssetStockParent = (id: string) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    if (isTempId(id)) {
      return queryClient.setQueryData(
        keyStore.assetStock.getSummary.queryKey,
        () => {
          const prev = queryClient.getQueryData<AssetManagementResponse>(
            keyStore.assetStock.getSummary.queryKey,
          );
          if (!prev) return;

          const newStock = prev.stock_assets.filter(
            (stock) => stock.parent.종목명 !== id,
          );

          return {
            ...prev,
            stock_assets: newStock,
          };
        },
      );
    }

    const item = itemNameList.find((stock) => stock.name_kr === id);

    if (!item) {
      setErrorInfo({
        field: "종목명",
        rowId: id,
        message: "잘못된 종목을 삭제하고 있어요.",
      });
      return;
    }

    deleteAssetStockParent({ accessToken: accessToken, item });
  };

  const handleStockNameChange = (id: string | number, item: ItemName) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    const prev = queryClient.getQueryData<AssetManagementResponse>(
      keyStore.assetStock.getSummary.queryKey,
    );

    if (!prev) return;

    const existingColumnIndex = prev.stock_assets.findIndex(
      (stock) => stock.parent.종목명 === item.name_kr,
    );

    if (existingColumnIndex !== -1) {
      setErrorInfo({
        field: "종목명",
        rowId: id,
        message: "이미 존재하는 종목이에요.",
      });
      return;
    }

    createAssetStockParent({
      accessToken: accessToken,
      body: {
        stock_code: item.code,
      },
      rowId: id,
    });
  };

  return {
    addEmptyParentColumn,
    handleDeleteAssetStockSub,
    handleValueChange,
    handleStockNameChange,
    handleAddEmptySubStock,
    handleDeleteAssetStockParent,
  };
};
