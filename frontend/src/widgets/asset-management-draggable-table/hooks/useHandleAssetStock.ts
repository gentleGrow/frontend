import {
  AssetManagementResponse,
  StockAssetParentWithType,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import { keyStore } from "@/shared/lib/query-keys";
import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";
import { useQueryClient } from "@tanstack/react-query";
import { usePostAssetStock } from "@/entities/assetManagement/queries/usePostAssetStock";
import { usePatchAssetStock } from "@/entities/assetManagement/queries/usePatchAssetStock";
import { useDeleteAssetStock } from "@/entities/assetManagement/queries/useDeleteAssetStock";
import { useSetAtom } from "jotai/index";
import { loginModalAtom } from "@/features";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import { createEmptyStockAsset } from "@/entities/assetManagement/utils/factory";

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
  const { mutate: originCreateAssetStock } = usePostAssetStock();
  const { mutate: originUpdateAssetStock } = usePatchAssetStock();
  const { mutate: deleteAssetStock } = useDeleteAssetStock();

  const updateAssetStock = useDebounce(originUpdateAssetStock, 500);
  const createAssetStock = useDebounce(originCreateAssetStock, 500);

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

        const newData = { ...prev };

        const targetRowIndex = newData.stock_assets.findIndex((stock) =>
          stock.sub.some((sub) => sub.id === id),
        );

        if (!targetRowIndex) return;

        const targetSub = newData.stock_assets[targetRowIndex].sub;

        newData.stock_assets[targetRowIndex].sub = targetSub.filter(
          (sub) => sub.id !== id,
        );

        return newData;
      },
    );
  };

  const handleValueChange = (key: string, value: any, id: number) => {
    if (!accessToken) {
      setIsOpenLoginModal(true);
      return;
    }

    setErrorInfo(null);
  };

  const handleStockNameChange = (name: string) => {
    const prev = queryClient.getQueryData<AssetManagementResponse>(
      keyStore.assetStock.getSummary.queryKey,
    );

    if (!prev) return;

    const existingColumnIndex = prev.stock_assets.findIndex(
      (stock) => stock.parent.종목명 === name,
    );

    if (existingColumnIndex !== -1) {
      // TODO: 에러 로직 추가
      return;
    }

    // TODO: 종목 추가
    console.log(name);
  };

  return {
    addEmptyParentColumn,
    handleDeleteRow,
    handleValueChange,
    handleStockNameChange,
  };
};
