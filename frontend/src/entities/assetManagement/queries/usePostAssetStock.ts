import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import {
  postAssetStock,
  PostAssetStockRequestBody,
} from "@/entities/assetManagement/apis/postAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";
import { AssetManagementResponse } from "@/widgets/asset-management-draggable-table/types/table";
import { groupBy } from "es-toolkit";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export const usePostAssetStock = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  const setCellError = useSetAtom(cellErrorAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.postAssetStock.queryKey,
    mutationFn: async ({
      accessToken,
      body,
    }: {
      accessToken: string;
      body: PostAssetStockRequestBody;
    }) => postAssetStock(accessToken, body),

    onSuccess: async (data, variables, _context) => {
      const response = (await data.json()) as {
        status_code: number;
        content: string;
        field: string;
      };

      if (String(response.status_code).startsWith("2")) {
        const id = variables.body.tempId;
        const prevData = queryClient.getQueryData<AssetManagementResponse>(
          keyStore.assetStock.getSummary.queryKey,
        );

        if (!prevData) {
          return;
        }

        const allSubRows = prevData.stock_assets
          .map((stockAsset) => stockAsset.sub)
          .flat();

        const notAddedRow = allSubRows.filter(
          (stockSub) => stockSub.id < 0 && stockSub.id !== id,
        );

        setLastUpdatedAt(new Date());
        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
          exact: true,
        });

        const groupedNotAddedRow = groupBy(
          notAddedRow,
          (item) => item.종목명.value,
        );

        queryClient.setQueryData<AssetManagementResponse>(
          keyStore.assetStock.getSummary.queryKey,
          () => {
            const currentData =
              queryClient.getQueryData<AssetManagementResponse>(
                keyStore.assetStock.getSummary.queryKey,
              );

            if (!currentData) {
              return;
            }

            const newData = { ...currentData };

            Object.entries(groupedNotAddedRow).forEach(([key, value]) => {
              const targetIndex = newData.stock_assets.findIndex(
                (stockAsset) => stockAsset.parent.종목명 === key,
              );

              if (targetIndex === -1) {
                return;
              }

              newData.stock_assets[targetIndex].sub.push(...value);
            });

            return newData;
          },
        );
      } else {
        setCellError({
          rowId: variables.body.tempId,
          field: response.field,
          message: response.content,
        });
      }
    },
  });
};
