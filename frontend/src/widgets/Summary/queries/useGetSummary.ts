import { useSuspenseQuery } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import { fetchSummary } from "@/widgets/Summary/api/fetchSummary";

export const useGetSummary = () =>
  useSuspenseQuery({
    queryFn: fetchSummary,
    queryKey: keyStore.summary.getSummary.queryKey,
  });
