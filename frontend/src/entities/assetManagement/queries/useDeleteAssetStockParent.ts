import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "../atoms/lastUpdatedAtAtom";
import { deleteAssetStockParent } from "@/entities/assetManagement/apis/deleteAssetStockParent";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";

export const useDeleteAssetStockParent = () => {
  const queryClient = useQueryClient();
  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.deleteAssetField.queryKey,
    mutationFn: async ({
      accessToken,
      item,
    }: {
      accessToken: string;
      item: ItemName;
    }) => deleteAssetStockParent(accessToken, item.code),

    onSuccess: async (data) => {
      const response = (await data.json()) as {
        status_code: number;
        content: string;
      };

      if (!String(response.status_code).startsWith("2")) {
        return;
      }

      setLastUpdatedAt(new Date());
      await queryClient.invalidateQueries({
        queryKey: keyStore.assetStock.getSummary.queryKey,
      });
    },
  });
};
