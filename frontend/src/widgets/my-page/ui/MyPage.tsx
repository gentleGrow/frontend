import { getUser } from "@/entities";
import ChangeNickname from "./ChangeNickname";

export default async function MyPage() {
  const user = await getUser();
  if (!user) return null;
  return (
    <section className="max-w-[557px]">
      <h2 className="mb-9 text-[28px] font-bold text-gray-100">마이페이지</h2>
      <ChangeNickname user={user} />
    </section>
  );
}
