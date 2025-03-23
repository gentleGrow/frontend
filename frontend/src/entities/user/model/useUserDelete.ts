import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import postDeleteUser from "../api/postDeleteUser";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/shared";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/cookie";

const useUserDelete = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deactivateUser, status: deactivateUserStatus } = useMutation({
    mutationFn: ({ reason }: { reason: string }) => postDeleteUser(reason),
    onSuccess: async (data) => {
      if (data === true) {
        deleteCookie(ACCESS_TOKEN);
        deleteCookie(REFRESH_TOKEN);
        await queryClient.setQueryData(keyStore.user.getUser.queryKey, null);
        router.replace("/?deactivated=true");
      }
    },
  });
  return { deactivateUser, deactivateUserStatus };
};

export default useUserDelete;
