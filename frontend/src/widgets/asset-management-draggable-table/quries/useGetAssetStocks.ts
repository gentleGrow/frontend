import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { getAssetsStock } from "@/widgets/asset-management-draggable-table/api/getAssetsStock";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { cloneDeep } from "es-toolkit";

export const useGetAssetStocks = (
  accessToken: string | null,
  options?: {
    sortBy: string | null;
    sortOrder: "asc" | "desc";
    type: "date" | "string" | "number";
    itemList: ItemName[];
  },
) => {
  return useSuspenseQuery({
    queryKey: keyStore.assetStock.getSummary.queryKey,
    queryFn: () => getAssetsStock(accessToken),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (oldData) => {
      const data = cloneDeep(oldData);

      if (!options) return data;

      if (options.sortBy === null) return data;

      data.stock_assets.forEach((stockAsset) => {
        stockAsset.sub.sort((a, b) => {
          if (options.sortOrder === "asc") {
            switch (options.type) {
              case "date":
                return (
                  new Date(a[options.sortBy!].value).getTime() -
                  new Date(b[options.sortBy!].value).getTime()
                );
              case "string":
                return a[options.sortBy!].value.localeCompare(
                  b[options.sortBy!].value,
                );
              default:
                const aValue =
                  a.주식통화 === "KRW"
                    ? a[options.sortBy!].value
                    : a[options.sortBy!].value * data.won_exchange;
                const bValue =
                  b.주식통화 === "KRW"
                    ? b[options.sortBy!].value
                    : b[options.sortBy!].value * data.won_exchange;

                return aValue - bValue;
            }
          }

          switch (options.type) {
            case "date":
              return (
                new Date(b[options.sortBy!].value).getTime() -
                new Date(a[options.sortBy!].value).getTime()
              );
            case "string":
              return b[options.sortBy!].value.localeCompare(
                a[options.sortBy!].value,
              );
            default:
              const aValue =
                a.주식통화 === "KRW"
                  ? a[options.sortBy!].value
                  : a[options.sortBy!].value * data.won_exchange;
              const bValue =
                b.주식통화 === "KRW"
                  ? b[options.sortBy!].value
                  : b[options.sortBy!].value * data.won_exchange;

              return bValue - aValue;
          }
        });
      });

      return data;
    },
  });
};
