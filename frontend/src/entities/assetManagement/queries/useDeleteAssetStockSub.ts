import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssetStockSub } from "../apis/deleteAssetStockSub";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "../atoms/lastUpdatedAtAtom";

export const useDeleteAssetStockSub = () => {
  const queryClient = useQueryClient();
  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.deleteAssetField.queryKey,
    mutationFn: async ({
      accessToken,
      id,
    }: {
      accessToken: string;
      id: number;
    }) => deleteAssetStockSub(accessToken, id),

    onSuccess: async () => {
      setLastUpdatedAt(new Date());
      await queryClient.invalidateQueries({
        queryKey: keyStore.assetStock.getSummary.queryKey,
      });
    },
  });
};
