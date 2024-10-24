import StockCompositionClient from "./StockCompositionClient";
import fetchComposition from "../api/fetchComposition";
import fetchDummyComposition from "../api/fetchDummyComposition";
import { getUser } from "@/entities";

export default async function StockComposition() {
  const user = await getUser();
  const [compositionData, accountData] =
    user && user.isJoined
      ? await Promise.all([
          fetchComposition("composition"),
          fetchComposition("account"),
        ])
      : await Promise.all([
          fetchDummyComposition("composition"),
          fetchDummyComposition("account"),
        ]);
  return (
    <div className="relative min-h-[388px] w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:rounded-none mobile:border-none except-mobile:h-[388px]">
      <h2 className="text-heading-2">종목 구성</h2>

      {
        <StockCompositionClient
          compositionData={compositionData}
          accountData={accountData}
        />
      }
    </div>
  );
}
