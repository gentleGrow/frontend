import { useMutation, useQueryClient } from "@tanstack/react-query";
import logout from "../actions/logout";
import { keyStore } from "@/shared/lib/query-keys";
import { useUser } from "@/entities";

const useUserLogout = () => {
  const { setUser } = useUser();
  const queryClient = useQueryClient();

  const { mutate: logoutUser } = useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.setQueryData(keyStore.user.getUser.queryKey, null);
    },
    onSuccess: () => {
      setUser(null);
    },
  });
  return { logoutUser };
};
export default useUserLogout;
