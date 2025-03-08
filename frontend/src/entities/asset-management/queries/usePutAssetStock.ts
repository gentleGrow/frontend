import { keyStore } from "@/shared/lib/query-keys";
import { useMutation } from "@tanstack/react-query";
import {
  putAssetStock,
  PutAssetStockRequestBody,
} from "@/entities/asset-management/apis/putAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/asset-management/atoms/lastUpdatedAtAtom";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import { useInvalidateAssetStock } from "@/entities/asset-management/queries/useInvalidateAssetStock";

export const usePutAssetStock = () => {
  const { invalidate } = useInvalidateAssetStock();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  const setCellError = useSetAtom(cellErrorAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.patchAssetStock.queryKey,
    mutationFn: async ({
      body,
      accessToken,
    }: {
      body: PutAssetStockRequestBody;
      accessToken: string;
    }) => putAssetStock(accessToken, body),

    onSuccess: async (data, variables) => {
      const response = (await data.json()) as {
        status_code: number;
        detail: string;
        field: string;
      };

      if (String(response.status_code).startsWith("2")) {
        await invalidate();
        setLastUpdatedAt(new Date());
      } else {
        setCellError({
          rowId: variables.body.id,
          field: response.field,
          message: response.detail,
        });
      }
    },
  });
};
