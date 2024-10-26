import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { getAssetsStock } from "@/widgets/asset-management-draggable-table/api/getAssetsStock";

export const useGetAssetStocks = (
  accessToken: string | null,
  sortOptions: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    type: "date" | "string" | "number";
  } | null,
) => {
  return useSuspenseQuery({
    queryKey: keyStore.assetStock.getSummary.queryKey,
    queryFn: () => getAssetsStock(accessToken),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    select: (data) => {
      if (!sortOptions) {
        return data;
      }

      return {
        ...data,
        stock_assets: data.stock_assets.sort((a, b) => {
          if (sortOptions.sortOrder === "asc") {
            switch (sortOptions.type) {
              case "date":
                return (
                  new Date(a[sortOptions.sortBy].value).getTime() -
                  new Date(b[sortOptions.sortBy].value).getTime()
                );
              case "string":
                return a[sortOptions.sortBy].value.localeCompare(
                  b[sortOptions.sortBy].value,
                );
              default:
                return (
                  a[sortOptions.sortBy].value - b[sortOptions.sortBy].value
                );
            }
          }

          switch (sortOptions.type) {
            case "date":
              return (
                new Date(b[sortOptions.sortBy].value).getTime() -
                new Date(a[sortOptions.sortBy].value).getTime()
              );
            case "string":
              return b[sortOptions.sortBy].value.localeCompare(
                a[sortOptions.sortBy].value,
              );
            default:
              return b[sortOptions.sortBy].value - a[sortOptions.sortBy].value;
          }
        }),
      };
    },
  });
};
