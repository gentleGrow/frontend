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
    type: "date" | "string" | "price" | "amount" | "ratio";
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
              case "price":
                const aValue =
                  a.주식통화 === "KRW"
                    ? a[options.sortingField!]
                    : a[options.sortingField!] * data.won_exchange;

                const bValue =
                  b.주식통화 === "KRW"
                    ? b[options.sortingField!]
                    : b[options.sortingField!] * data.won_exchange;

                return aValue - bValue;
              case "amount":
                return a[options.sortingField!] - b[options.sortingField!];
              case "ratio":
                return a[options.sortingField!] - b[options.sortingField!];
              default:
                // 순서 변경하지 않음.
                return 0;
            }
          } else {
            switch (options.type) {
              case "date":
                return (
                  new Date(b[options.sortingField!]).getTime() -
                  new Date(a[options.sortingField!]).getTime()
                );
              case "string":
                return b[options.sortingField!].localeCompare(
                  a[options.sortingField!].localeCompare,
                );
              case "price":
                const aValue =
                  a.주식통화 === "KRW"
                    ? a[options.sortingField!]
                    : a[options.sortingField!] * data.won_exchange;

                const bValue =
                  b.주식통화 === "KRW"
                    ? b[options.sortingField!]
                    : b[options.sortingField!] * data.won_exchange;

                return bValue - aValue;
              case "amount":
                return b[options.sortingField!] - a[options.sortingField!];
              case "ratio":
                return b[options.sortingField!] - a[options.sortingField!];
              default:
                // 순서 변경하지 않음.
                return 0;
            }
          }
        });
      });

      return data;
    },
  });
};
