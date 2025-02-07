import { useMutation, useQueryClient } from "@tanstack/react-query";
import logout from "../actions/logout";
import { keyStore } from "@/shared/lib/query-keys";
import { useRouter } from "next/navigation";
import { useUser } from "@/entities";

const useUserLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: clientLogout } = useUser();

  const { mutate: logoutUser } = useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.setQueryData(keyStore.user.getUser.queryKey, null);
      clientLogout();
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  return { logoutUser };
};
export default useUserLogout;
