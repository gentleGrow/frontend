import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssetStockSub } from "../apis/deleteAssetStockSub";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "../atoms/lastUpdatedAtAtom";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export const useDeleteAssetStockSub = () => {
  const queryClient = useQueryClient();
  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  const setCellError = useSetAtom(cellErrorAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.deleteAssetField.queryKey,
    mutationFn: async ({
      accessToken,
      id,
    }: {
      accessToken: string;
      id: number;
    }) => deleteAssetStockSub(accessToken, id),

    onSuccess: async (data, variables) => {
      const response = (await data.json()) as {
        status_code: number;
        content: string;
      };

      if (!String(response.status_code).startsWith("2")) {
        return setCellError({
          rowId: variables.id,
          field: "종목명",
          message: response.content,
        });
      }

      setLastUpdatedAt(new Date());
      await queryClient.invalidateQueries({
        queryKey: keyStore.assetStock.getSummary.queryKey,
      });
    },
  });
};
