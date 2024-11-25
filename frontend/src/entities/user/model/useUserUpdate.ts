import { useMutation, useQueryClient } from "@tanstack/react-query";
import putUserNickname from "../api/putUserNickname";
import { keyStore } from "@/shared/lib/query-keys";
import { User } from "../types/user";

const useUserUpdate = () => {
  const queryClient = useQueryClient();
  const { mutate: updateNickname, status: updateNicknameStatus } = useMutation({
    mutationFn: ({ newNickname }: { newNickname: string }) =>
      putUserNickname(newNickname),
    onSuccess: async (data, variables) => {
      await queryClient.setQueryData(
        keyStore.user.getUser.queryKey,
        (old: User) => {
          return { ...old, nickname: variables.newNickname };
        },
      );
    },
  });
  return { updateNickname, updateNicknameStatus };
};
export default useUserUpdate;
