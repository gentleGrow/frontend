import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { postAssetStock } from "@/entities/assetManagement/apis/postAssetStock";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";

export const usePostAssetStock = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  return useMutation({
    mutationKey: keyStore.assetStock.postAssetStock.queryKey,
    mutationFn: async ({ accessToken }: { accessToken: string }) =>
      postAssetStock(accessToken),

    onSuccess: async (data, variables, _context) => {
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
      }
    },
  });
};
