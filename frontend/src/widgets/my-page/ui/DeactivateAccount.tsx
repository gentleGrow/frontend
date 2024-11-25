"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeactivateAccount() {
  const router = useRouter();
  return (
    <article>
      <label className="text-heading-2 text-gray-100" htmlFor="nickname">
        회원 탈퇴
      </label>
      <p className="mb-5 mt-2 font-medium leading-6 text-gray-80 mobile-545:w-[211px]">
        계정을 삭제하시려면 아래 회원 탈퇴하기 버튼을 클릭해 주세요.
      </p>

      <Button
        variant="outline"
        className="h-9 rounded-lg text-body-3 font-semibold"
        onMouseDown={() => router.prefetch("/my-page/deactivate")}
        onClick={() => {
          router.push("/my-page/deactivate");
        }}
      >
        회원 탈퇴하기
      </Button>
    </article>
  );
}
