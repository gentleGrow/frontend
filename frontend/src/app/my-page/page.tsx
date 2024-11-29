import { getUser } from "@/entities";
import { keyStore } from "@/shared/lib/query-keys";
import { MyPage } from "@/widgets";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: keyStore.user.getUser.queryKey,
    queryFn: getUser,
  });
  const user = queryClient.getQueryData(keyStore.user.getUser.queryKey);
  if (!user) redirect("/");
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPage />
    </HydrationBoundary>
  );
}
