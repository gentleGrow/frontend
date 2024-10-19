import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { getAssetsStock } from "@/widgets/asset-management-draggable-table/api/getAssetsStock";

export const useGetAssetStocks = (accessToken: string | null) => {
  return useSuspenseQuery({
    queryKey: keyStore.assetStock.getSummary.queryKey,
    queryFn: () => getAssetsStock(accessToken),
  });
};
