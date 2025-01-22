import { putAssetField } from "@/entities/asset-management/apis/putAssetField";
import { keyStore } from "@/shared/lib/query-keys";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/asset-management/atoms/lastUpdatedAtAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePutAssetField = () => {
  const queryClient = useQueryClient();

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  return useMutation({
    mutationKey: keyStore.assetField.putAssetField.queryKey,
    mutationFn: async ({
      newFields,
      accessToken,
    }: {
      newFields: string[];
      accessToken: string;
    }) => putAssetField(accessToken, newFields),

    onSuccess: async (data) => {
      setLastUpdatedAt(new Date());

      const body = (await data.json()) as {
        status_code: number;
        content: string;
      };

      if (String(body?.status_code).startsWith("2")) {
        await queryClient.invalidateQueries({
          queryKey: keyStore.assetStock.getSummary.queryKey,
          exact: true,
        });
      }
    },
  });
};
