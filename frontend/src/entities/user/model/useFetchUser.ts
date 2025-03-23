import { useQuery } from "@tanstack/react-query";
import getUser from "../api/getUser";
import { keyStore } from "@/shared/lib/query-keys";

const useFetchUser = () => {
  const { data: user, status: getUserStatus } = useQuery({
    queryKey: keyStore.user.getUser.queryKey,
    queryFn: async () => await getUser(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { user, getUserStatus };
};

export default useFetchUser;
