import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchAssetStock,
  PatchAssetStockRequestBody,
} from "@/entities/assetManagement/apis/patchAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export const usePatchAssetStock = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  const setCellError = useSetAtom(cellErrorAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.patchAssetStock.queryKey,
    mutationFn: async ({
      body,
      accessToken,
    }: {
      body: PatchAssetStockRequestBody;
      accessToken: string;
    }) => patchAssetStock(accessToken, body),

    onSuccess: async (data, variables) => {
      const response = (await data.json()) as {
        status_code: number;
        content: string;
        field: string;
      };

      if (String(response.status_code).startsWith("2")) {
        setLastUpdatedAt(new Date());
        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
          exact: true,
        });
      } else {
        setCellError({
          rowId: variables.body.id,
          field: response.field,
          message: response.content,
        });
      }
    },
  });
};
