import fetchComposition from "../api/fetchComposition";
import StockCompositionClient from "./StockCompositionClient";

export default async function StockComposition() {
  const [compositionData, accountData] = await Promise.all([
    fetchComposition("composition"),
    fetchComposition("account"),
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
