import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import {
  postAssetStock,
  PostAssetStockRequestBody,
} from "@/entities/assetManagement/apis/postAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";
import { AssetStock } from "@/widgets/asset-management-draggable-table/types/table";

export const usePostAssetStock = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.postAssetStock.queryKey,
    mutationFn: async ({
      accessToken,
      body,
    }: {
      accessToken: string;
      body: PostAssetStockRequestBody;
    }) => postAssetStock(accessToken, body),

    onSuccess: async (_data, variables, _context) => {
      const response = (await _data.json()) as {
        status_code: number;
        content: string;
        field: string;
      };

      if (String(response).startsWith("2")) {
        const id = variables.body.tempId;
        const prevData = queryClient.getQueryData<AssetStock>(
          keyStore.assetStock.getSummary.queryKey,
        );

        if (!prevData) {
          return;
        }

        const notAddedRow = prevData.stock_assets.filter(
          (stock) => stock.id < 0 && stock.id !== id,
        );

        setLastUpdatedAt(new Date());
        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
        });

        queryClient.setQueryData<AssetStock>(
          keyStore.assetStock.getSummary.queryKey,
          () => {
            const currentData = queryClient.getQueryData<AssetStock>(
              keyStore.assetStock.getSummary.queryKey,
            );

            if (!currentData) {
              return;
            }

            return {
              ...currentData,
              stock_assets: [...currentData.stock_assets, ...notAddedRow],
            };
          },
        );
      }
    },
  });
};
