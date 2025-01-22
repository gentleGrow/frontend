import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keyStore } from "@/shared/lib/query-keys";
import {
  postAssetStock,
  PostAssetStockRequestBody,
} from "@/entities/asset-management/apis/postAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/asset-management/atoms/lastUpdatedAtAtom";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export const usePostAssetStockSub = () => {
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

      if (!String(response.status_code).startsWith("2")) {
        return setCellError({
          rowId: response.field,
          field: response.field,
          message: response.content,
        });
      }

      if (String(response.status_code).startsWith("2")) {
        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
          exact: true,
        });

        setLastUpdatedAt(new Date());

        return;
      }
    },
  });
};
