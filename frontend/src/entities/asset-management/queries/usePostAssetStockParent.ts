import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import {
  postAssetStock,
  PostAssetStockRequestBody,
} from "@/entities/asset-management/apis/postAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/asset-management/atoms/lastUpdatedAtAtom";
import { AssetStock } from "@/entities/asset-management/types/asset-management";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import { ItemName } from "@/entities/asset-management/apis/getItemNameList";
import { openedFieldAtom } from "@/features/asset-management";

export const usePostAssetStockParent = (itemNames: ItemName[]) => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  const setCellError = useSetAtom(cellErrorAtom);
  const setOpenedField = useSetAtom(openedFieldAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.postAssetStock.queryKey,
    mutationFn: async ({
      accessToken,
      body,
    }: {
      accessToken: string;
      body: PostAssetStockRequestBody;
      rowId: string | number;
    }) => postAssetStock(accessToken, body),

    onSuccess: async (data, variables, _context) => {
      const stockName = itemNames.find(
        (item) => item.code === variables.body.stock_code,
      );

      if (!stockName) {
        return setCellError({
          rowId: variables.rowId,
          field: "종목명",
          message: "종목 코드가 존재하지 않습니다.",
        });
      }

      const response = (await data.json()) as {
        status_code: number;
        content: string;
        field: string;
      };

      const prevData = queryClient.getQueryData<AssetStock>(
        keyStore.assetStock.getSummary.queryKey,
      );

      if (!String(response.status_code).startsWith("2")) {
        return setCellError({
          rowId: variables.rowId,
          field: response.field,
          message: response.content,
        });
      }

      if (!prevData) return;

      if (String(response.status_code).startsWith("2")) {
        const tempIdColumns = prevData.stock_assets.filter(
          (stock) => stock.parent.종목명 === "",
        );

        const newStock = [...prevData.stock_assets];

        // 저장된 칼럼 하나 제거
        tempIdColumns.pop();

        newStock.push(...tempIdColumns);

        queryClient.setQueryData<AssetStock>(
          keyStore.assetStock.getSummary.queryKey,
          (prev) => {
            if (!prev) return;

            return {
              ...prev,
              stock_assets: newStock,
            };
          },
        );

        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
          exact: true,
        });

        setOpenedField((prev) => {
          const newField = new Set(prev);
          newField.add(stockName.name_kr);
          return newField;
        });
        setLastUpdatedAt(new Date());

        return;
      }
    },
  });
};
