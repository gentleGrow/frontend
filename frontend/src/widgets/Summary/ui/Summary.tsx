import fetchSummary from "../api/fetchSummary";
import SummaryCard from "./SummaryCard";
export const SummaryTitle = {
  today_review_rate: "오늘의 review",
  total_asset_amount: "나의 총 자산",
  total_investment_amount: "나의 투자 금액",
  profit: "수익금",
};
export default async function Summary() {
  const summary = await fetchSummary();
  return (
    <div className="flex space-x-[16px]">
      {Object.keys(summary).map((item, i) => (
        <SummaryCard
          key={i}
          title={SummaryTitle[item]}
          amount={summary[item].profit_amount || summary[item]}
          rate={summary[item].profit_rate || undefined}
        />
      ))}
    </div>
  );
}
