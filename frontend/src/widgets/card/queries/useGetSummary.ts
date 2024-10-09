import { useSuspenseQuery } from "@tanstack/react-query";
import { getSummary } from "@/widgets/card/api/getSummary";
import { keyStore } from "@/shared/lib/query-keys";

export const useGetSummary = () =>
  useSuspenseQuery({
    queryFn: getSummary,
    queryKey: keyStore.summary.getSummary.queryKey,
  });
