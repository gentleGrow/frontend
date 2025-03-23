"use client";
import useFetchUser from "@/entities/user/model/useFetchUser";
import ChangeNickname from "./ChangeNickname";
import DeactivateAccount from "./DeactivateAccount";

export default function MyPage() {
  const { user } = useFetchUser();
  if (!user) return null;
  return (
    <section className="max-w-[557px]">
      <h2 className="mb-9 text-[28px] font-bold text-gray-100">마이페이지</h2>
      <ChangeNickname user={user} />
      <div className="mt-[64px]" />
      <DeactivateAccount />
    </section>
  );
}
