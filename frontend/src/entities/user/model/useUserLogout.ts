import { useMutation, useQueryClient } from "@tanstack/react-query";
import logout from "../actions/logout";
import { keyStore } from "@/shared/lib/query-keys";

const useUserLogout = () => {
  const queryClient = useQueryClient();
  const { mutate: logoutUser } = useMutation({
    mutationFn: () => logout(),
    onMutate: () => {
      queryClient.setQueryData(keyStore.user.getUser.queryKey, null);
    },
  });
  return { logoutUser };
};
export default useUserLogout;
