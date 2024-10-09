"use client";

import SummaryCard from "./SummaryCard";

import { useGetSummary } from "./queries/useGetSummary";

import { GetSummaryResponse } from "./api/getSummary";

type SummaryDataKey = keyof GetSummaryResponse;

const convertFieldToTitle: Record<SummaryDataKey, string> = {
  today_review_rate: "오늘의 review",
  total_asset_amount: "나의 총 자산",
  total_investment_amount: "나의 투자 금액",
  profit: "수익금",
};

export default function Summary() {
  const { data: summaryData } = useGetSummary();

  const profit = {
    title: convertFieldToTitle.profit,
    type: "rate",
    amount: summaryData.profit.profit_rate,
  };

  const profitFilteredData = Object.entries(summaryData).filter(
    ([key]) => key !== "profit",
  );

  return (
    <div className="flex space-x-[16px]">
      {profitFilteredData.map(([key, value]) => (
        <SummaryCard
          key={key}
          title={convertFieldToTitle[key]}
          type={"amount"}
          amount={value}
        />
      ))}
    </div>
  );
}
