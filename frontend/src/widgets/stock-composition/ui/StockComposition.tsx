import StockCompositionClient from "./StockCompositionClient";
import fetchComposition from "../api/fetchComposition";
import fetchDummyComposition from "../api/fetchDummyComposition";
import { cookies } from "next/headers";

export default async function StockComposition() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;
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
    <div className="relative w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:rounded-none mobile:border-none except-mobile:h-[388px]">
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
