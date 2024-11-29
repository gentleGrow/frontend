import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keyStore } from "@/shared/lib/query-keys";
import postDeleteUser from "../api/postDeleteUser";
import { useRouter } from "next/navigation";

const useUserDelete = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deactivateUser, status: deactivateUserStatus } = useMutation({
    mutationFn: ({ reason }: { reason: string }) => postDeleteUser(reason),
    onSuccess: async (data) => {
      if (data === true) {
        await queryClient.setQueryData(keyStore.user.getUser.queryKey, null);
        router.replace("/?deactivated=true");
      }
    },
  });
  return { deactivateUser, deactivateUserStatus };
};
export default useUserDelete;
