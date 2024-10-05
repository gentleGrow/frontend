import React from "react";
import fetchSummary from "../api/fetchSummary";
import SummaryCard from "./SummaryCard";
import SummaryCardMobile from "./SummaryCardMobile";
import { cookies } from "next/headers";
import fetchSampleSummary from "../api/fetchSampleSummary";
export const SummaryTitle = {
  today_review_rate: "오늘의 review",
  total_asset_amount: "나의 총 자산",
  total_investment_amount: "나의 투자 금액",
  profit: "수익금",
};
export default async function Summary() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;
  const summary = hasAccessToken
    ? await fetchSummary()
    : await fetchSampleSummary();
  return (
    <>
      <div className="flex w-full mobile:hidden except-mobile:space-x-[16px]">
        {Object.keys(summary).map((item, i) => (
          <SummaryCard
            key={i}
            title={SummaryTitle[item]}
            amount={summary[item].profit_amount || summary[item]}
            rate={summary[item].profit_rate || undefined}
          />
        ))}
      </div>
      <div className="hidden mobile:block">
        <SummaryCardMobile
          totalAmount={summary.total_asset_amount}
          reviewRate={summary.today_review_rate}
          investmentAmount={summary.total_investment_amount}
          profit_amount={summary.profit.profit_amount}
          profit_rate={summary.profit.profit_rate}
        />
      </div>
    </>
  );
}
