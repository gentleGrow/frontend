import { useQueryClient } from "@tanstack/react-query";
import { AssetManagementResponse } from "@/widgets/asset-management-draggable-table/types/table";
import { keyStore } from "@/shared/lib/query-keys";

export const useClientSubStock = () => {
  const queryClient = useQueryClient();

  const update = (id: number, key: string, value: unknown) => {
    queryClient.setQueryData<AssetManagementResponse>(
      keyStore.assetStock.getSummary.queryKey,
      () => {
        const prev = queryClient.getQueryData<AssetManagementResponse>(
          keyStore.assetStock.getSummary.queryKey,
        );

        if (!prev) return;

        const newStock = prev.stock_assets.map((stock) => {
          return {
            ...stock,
            sub: stock.sub.map((sub) => {
              if (sub.id === id) {
                return {
                  ...sub,
                  [key]: value,
                };
              }
              return sub;
            }),
          };
        });

        return {
          ...prev,
          stock_assets: newStock,
        };
      },
    );
  };

  return {
    update,
  };
};
