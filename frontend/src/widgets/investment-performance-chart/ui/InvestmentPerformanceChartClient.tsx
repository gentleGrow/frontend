"use client";

import {
  LineChart,
  NoDataMessage,
  SegmentedButton,
  SegmentedButtonGroup,
} from "@/shared";
import { useState } from "react";
import PercentWithTitle from "./PercentWithTitle";
import { PerformanceAnalysisData } from "../api/fetchPerformanceAnalysis";

const PERIODS = [
  { period: "5일", performanceDataKey: "fiveDayPerformanceData" },
  { period: "1달", performanceDataKey: "monthlyPerformanceData" },
  { period: "3달", performanceDataKey: "threeMonthPerformanceData" },
  { period: "6달", performanceDataKey: "sixMonthPerformanceData" },
  { period: "1년", performanceDataKey: "yearlyPerformanceData" },
];

export default function InvestmentPerformanceChartClient({
  performanceData,
}: {
  performanceData: PerformanceAnalysisData;
}) {
  const [currentPerformanceDataKey, setCurrentPerformanceDataKey] =
    useState<string>("fiveDayPerformanceData");
  const currentData = performanceData[currentPerformanceDataKey];
  return (
    <div className="relative h-[388px] w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:h-[500px] mobile:rounded-none mobile:border-none">
      <h2 className="text-heading-2">투자 성과 분석</h2>
      <div className="mt-[16px] flex w-full justify-between except-mobile:absolute except-mobile:right-[16px] except-mobile:top-[12px] except-mobile:mt-0">
        <div className="w-[176px] shrink-0 mobile:hidden" />
        <div className="w-full except-mobile:w-[428px]">
          <SegmentedButtonGroup>
            {PERIODS.map((period) => (
              <SegmentedButton
                key={period.period}
                onClick={() =>
                  setCurrentPerformanceDataKey(period.performanceDataKey)
                }
              >
                {period.period}
              </SegmentedButton>
            ))}
          </SegmentedButtonGroup>
        </div>
      </div>
      <div className="flex items-center mobile:flex-col except-mobile:justify-between">
        <div
          className={`space-y-[32px] mobile:mt-[24px] mobile:flex mobile:w-full mobile:space-x-[16px] mobile:space-y-0 ${currentData.xAxises.length === 0 && "hidden mobile:hidden"}`}
        >
          <PercentWithTitle
            title="내 수익률"
            percent={
              performanceData[currentPerformanceDataKey]?.myReturnRate || 0
            }
          />
          <PercentWithTitle
            title="시장 수익률 대비"
            percent={
              performanceData[currentPerformanceDataKey]
                ?.contrastMarketReturns || 0
            }
          />
        </div>
        {currentData.xAxises.length === 0 ? (
          <NoDataMessage />
        ) : (
          <LineChart data={currentData} type={currentPerformanceDataKey} />
        )}
      </div>
    </div>
  );
}
