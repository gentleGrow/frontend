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
import { parseAssetStockKeyToJsonKey } from "@/entities/assetManagement/utils/parseAssetStockKeyToJsonKey";
import { usePutAssetStock } from "@/entities/assetManagement/queries/usePutAssetStock";

let tempId = -1;

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
  const { mutate: putAssetStock } = usePutAssetStock();
  const { mutate: originPostAssetStockSub } = usePostAssetStockSub();
  const { mutate: deleteAssetStockSub } = useDeleteAssetStockSub();
  const { mutate: deleteAssetStockParent } = useDeleteAssetStockParent();

  const createAssetStockParent = useDebounce(originCreateAssetStockParent, 500);

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);
  const setErrorInfo = useSetAtom(cellErrorAtom);

  const queryClient = useQueryClient();

  const addEmptyParentColumn = () => {
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
                  [key]: value,
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
    setErrorInfo(null);

    // 1. stock_code 를 찾는다.
    const stockName = tableData.find((stock) => stock.id === id)?.종목명;

    if (!stockName) {
      setErrorInfo({
        field: "종목명",
        rowId: id,
        message: "종목명이 없어요.",
      });
      return;
    }

    // TODO: 나중에 API 수정될거임 그거 수정한 이후 다시 작업하기 -> 수정사항 반영 완료 나머지 작업 진행하기
    const stockItem = itemNameList.find((item) => item.name_kr === stockName);

    if (!stockItem) {
      setErrorInfo({
        field: "종목명",
        rowId: id,
        message: "잘못된 종목이에요.",
      });
      return;
    }

    // 2. 어떤 필드가 변경되었는지 찾고 그에 상응하는 key 값으로 변경한다.
    const parsedKey = parseAssetStockKeyToJsonKey(key);

    putAssetStock({
      body: {
        [parsedKey]: value,
        stock_code: stockItem?.code,
        id,
      },
      accessToken,
    });
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
