import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { getAssetsStock } from "@/widgets/asset-management-draggable-table/api/getAssetsStock";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";

export const useGetAssetStocks = (
  accessToken: string | null,
  options: {
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
    refetchOnWindowFocus: true,
    select: (data) => {
      if (options.sortBy === null) return data;

      data.stock_assets.sort((a, b) => {
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
              return a[options.sortBy!].value - b[options.sortBy!].value;
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
            return b[options.sortBy!].value - a[options.sortBy!].value;
        }
      });

      return {
        ...data,
      };
    },
  });
};
