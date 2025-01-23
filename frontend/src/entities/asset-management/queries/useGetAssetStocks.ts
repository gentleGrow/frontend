import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { getAssetsStock } from "@/entities/asset-management/apis/getAssetsStock";
import { ItemName } from "@/entities/asset-management/apis/getItemNameList";
import { cloneDeep } from "es-toolkit";

export const useGetAssetStocks = (
  accessToken: string | null,
  options?: {
    sortingField: string | null;
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
    refetchOnWindowFocus: false,
    select: (oldData) => {
      const data = cloneDeep(oldData);

      if (!options) return data;

      if (options.sortingField === null) return data;

      data.stock_assets.forEach((stockAsset) => {
        stockAsset.sub.sort((a, b) => {
          if (options.sortOrder === "asc") {
            switch (options.type) {
              case "date":
                return (
                  new Date(a[options.sortingField!]).getTime() -
                  new Date(b[options.sortingField!]).getTime()
                );
              case "string":
                return a[options.sortingField!].localeCompare(
                  b[options.sortingField!],
                );
              default:
                const aValue =
                  a.주식통화 === "KRW"
                    ? a[options.sortingField!]
                    : a[options.sortingField!] * data.won_exchange;
                const bValue =
                  b.주식통화 === "KRW"
                    ? b[options.sortingField!]
                    : b[options.sortingField!] * data.won_exchange;

                return aValue - bValue;
            }
          }

          switch (options.type) {
            case "date":
              return (
                new Date(b[options.sortingField!].value).getTime() -
                new Date(a[options.sortingField!].value).getTime()
              );
            case "string":
              return b[options.sortingField!].value.localeCompare(
                a[options.sortingField!].value,
              );
            default:
              const aValue =
                a.주식통화 === "KRW"
                  ? a[options.sortingField!].value
                  : a[options.sortingField!].value * data.won_exchange;
              const bValue =
                b.주식통화 === "KRW"
                  ? b[options.sortingField!].value
                  : b[options.sortingField!].value * data.won_exchange;

              return bValue - aValue;
          }
        });
      });

      return data;
    },
  });
};
