import { FRONT_SERVER_URL } from "@/shared";
import StockCompositionClient from "./StockCompositionClient";
import fetchComposition from "../api/fetchComposition";
import fetchDummyComposition from "../api/fetchDummyComposition";

export default async function StockComposition() {
  const hasAccessToken = await fetch(
    `${FRONT_SERVER_URL}/api/user/has-access-token`,
    { method: "POST" },
  )
    .then((res) => res.json())
    .then((data) => data.hasAccessToken);
  const [compositionData, accountData] = hasAccessToken
    ? await Promise.all([
        fetchComposition("composition"),
        fetchComposition("account"),
      ])
    : await Promise.all([
        fetchDummyComposition("composition"),
        fetchDummyComposition("account"),
      ]);

  return (
    <div className="relative w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:border-none except-mobile:h-[388px]">
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
