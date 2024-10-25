import { keyStore } from "@/shared/lib/query-keys";
import { useMutation } from "@tanstack/react-query";
import {
  patchAssetStock,
  PatchAssetStockRequestBody,
} from "@/entities/assetManagement/apis/patchAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";

export const usePatchAssetStock = () => {
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

    onSuccess: () => {
      setLastUpdatedAt(new Date());
    },
  });
};
