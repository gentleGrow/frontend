import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssetStock } from "../apis/deleteAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "../atoms/lastUpdatedAtAtom";

export const useDeleteAssetStock = () => {
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
    }) => deleteAssetStock(accessToken, id),

    onSuccess: () => {
      setLastUpdatedAt(new Date());
      void queryClient.invalidateQueries({
        queryKey: keyStore.assetStock.getSummary.queryKey,
      });
    },
  });
};
