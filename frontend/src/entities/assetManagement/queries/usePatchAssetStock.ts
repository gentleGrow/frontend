import { keyStore } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchAssetStock,
  PatchAssetStockRequestBody,
} from "@/entities/assetManagement/apis/patchAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";

export const usePatchAssetStock = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);
  return useMutation({
    mutationKey: keyStore.assetStock.patchAssetStock.queryKey,
    mutationFn: async ({
      body,
      accessToken,
    }: {
      body: PatchAssetStockRequestBody;
      accessToken: string;
    }) => patchAssetStock(accessToken, body),

    onSuccess: async () => {
      setLastUpdatedAt(new Date());
      await queryClient.invalidateQueries({
        queryKey: keyStore.assetStock.getSummary.queryKey,
      });
    },
  });
};
