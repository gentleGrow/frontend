import React from "react";
import SummaryCard from "./SummaryCard";
import SummaryCardMobile from "./SummaryCardMobile";
import { checkIsJoined } from "@/features/login/api/checkIsJoined";
import {
  fetchSampleSummary,
  fetchSummary,
} from "@/widgets/Summary/api/fetchSummary";

export const SummaryTitle = {
  increase_asset_amount: "지난 달 보다",
  total_asset_amount: "나의 총 자산",
  total_investment_amount: "나의 투자 금액",
  profit: "수익금",
};

export default async function Summary() {
  const isJoined = await checkIsJoined();
  const summary = isJoined ? await fetchSummary() : await fetchSampleSummary();

  return (
    <>
      <div className="flex w-full mobile:hidden except-mobile:space-x-[16px]">
        {Object.keys(summary).map((item) => (
          <SummaryCard
            key={item}
            title={SummaryTitle[item]}
            amount={
              summary[item].profit_amount || typeof summary[item] === "object"
                ? summary[item].profit_amount
                : summary[item]
            }
            rate={summary[item].profit_rate || 0}
          />
        ))}
      </div>
      <div className="hidden mobile:block">
        <SummaryCardMobile
          totalAmount={summary.total_asset_amount}
          increaseAmount={summary.increase_asset_amount}
          investmentAmount={summary.total_investment_amount}
          profit_amount={summary.profit.profit_amount}
          profit_rate={summary.profit.profit_rate}
        />
      </div>
    </>
  );
}
