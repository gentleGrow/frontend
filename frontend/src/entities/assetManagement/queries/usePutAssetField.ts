import { putAssetField } from "@/entities/assetManagement/apis/putAssetField";
import { keyStore } from "@/shared/lib/query-keys";
import { useSetAtom } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/assetManagement/atoms/lastUpdatedAtAtom";
import { useMutation } from "@tanstack/react-query";

export const usePutAssetField = () => {
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

    onSuccess: () => {
      setLastUpdatedAt(new Date());
    },
  });
};
