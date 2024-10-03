"use client";
import {
  BarChart,
  BarChartData,
  DonutChart,
  DonutChartData,
  SegmentedButton,
  SegmentedButtonGroup,
} from "@/shared";
import { useState } from "react";
import ArrowNavigator from "./ArrowNavigator";
import React from "react";

export default function EstimateDividendClient({
  estimatedDividendAll,
  estimatedDividendByStock,
}: {
  estimatedDividendAll: BarChartData;
  estimatedDividendByStock: DonutChartData[];
}) {
  const [selectedTab, setSelectedTab] = useState<string>("모두");
  const barChartNavItems = Object.keys(estimatedDividendAll);
  const [currentNavItemIndex, setCurrentNavItemIndex] = useState<number>(
    barChartNavItems.length - 1 <= 0 ? 0 : barChartNavItems.length - 1,
  );
  return (
    <div
      className={`relative ${selectedTab === "모두" ? "h-[390px]" : "h-full"} w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:rounded-none ${selectedTab === "모두" ? "mobile:h-[500px]" : "h-full"} mobile:border-none`}
    >
      <h2 className="text-heading-2">예상 배당액</h2>
      <div className="mt-[16px] flex w-full justify-between except-mobile:absolute except-mobile:right-[16px] except-mobile:top-[12px] except-mobile:mt-0">
        <div className="w-[176px] shrink-0 mobile:hidden" />
        <div className="w-full except-mobile:w-[148px]">
          <SegmentedButtonGroup>
            <SegmentedButton onClick={() => setSelectedTab("모두")}>
              모두
            </SegmentedButton>
            <SegmentedButton onClick={() => setSelectedTab("종목별")}>
              종목별
            </SegmentedButton>
          </SegmentedButtonGroup>
        </div>
      </div>
      {selectedTab === "모두" && (
        <>
          <div className="mb-[16px] mt-[20px]">
            <ArrowNavigator
              navItems={barChartNavItems}
              currentNavItemIndex={currentNavItemIndex}
              handlerPrev={() => {
                setCurrentNavItemIndex((prev) => prev - 1);
              }}
              handlerNext={() => {
                setCurrentNavItemIndex((prev) => prev + 1);
              }}
            />
          </div>
          <div className="space-y-[4px]">
            <p className="text-body-3">
              {barChartNavItems[currentNavItemIndex]}년 총 배당액
            </p>
            <p className="text-[28px] font-bold leading-[33.61px]">
              ₩
              {Number(
                (
                  estimatedDividendAll[barChartNavItems[currentNavItemIndex]]
                    ?.total * 10000
                ).toFixed(0),
              ).toLocaleString("ko-KR")}
            </p>
          </div>
        </>
      )}

      <div
        className={`${selectedTab === "모두" ? "h-[217px]" : "h-full"} w-full`}
      >
        {selectedTab === "모두" ? (
          <BarChart
            chartData={
              barChartNavItems.length > 0
                ? {
                    ...(({ sum, ...rest }) => rest)(
                      estimatedDividendAll[
                        barChartNavItems[currentNavItemIndex]
                      ],
                    ),
                  }
                : { xAxises: [], data: [], unit: "", total: 0 }
            }
          />
        ) : (
          <div className="pt-[41px]">
            <DonutChart
              chartName="예상 배당액"
              data={estimatedDividendByStock}
            />
          </div>
        )}
      </div>
    </div>
  );
}
