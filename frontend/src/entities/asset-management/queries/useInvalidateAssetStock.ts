import { keyStore } from "@/shared/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { usePreservedCallback } from "@toss/react";

export const useInvalidateAssetStock = () => {
  const queryClient = useQueryClient();

  const invalidate = usePreservedCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: keyStore.assetStock.getSummary.queryKey,
      exact: true,
    });
  });

  return {
    invalidate,
  };
};
