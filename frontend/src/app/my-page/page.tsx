import { redirect } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { MyPage } from "@/widgets";
import { getUser } from "@/entities";
import { keyStore } from "@/shared/lib/query-keys";

export const dynamic = "force-dynamic";

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
