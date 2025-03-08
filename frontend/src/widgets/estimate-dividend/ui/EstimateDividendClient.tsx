"use client";
import {
  BarChart,
  DonutChart,
  DonutChartData,
  EstimateDividendAllData,
  NoDataMessage,
  SegmentedButton,
  SegmentedButtonGroup,
  TooltipWithIcon,
} from "@/shared";
import React, { useMemo, useState } from "react";
import ArrowNavigator from "./ArrowNavigator";

export default function EstimateDividendClient({
  estimatedDividendAll,
  estimatedDividendByStock,
}: {
  estimatedDividendAll: EstimateDividendAllData;
  estimatedDividendByStock: DonutChartData[];
}) {
  const [selectedTab, setSelectedTab] = useState<string>("모두");
  const barChartNavItems = Object.keys(estimatedDividendAll);
  const [currentNavItemIndex, setCurrentNavItemIndex] = useState<number>(
    barChartNavItems.length - 1 <= 0 ? 0 : barChartNavItems.length - 1,
  );

  // Sort the donut chart data by current_amount in descending order
  const sortedDividendByStock = useMemo(() => {
    return [...estimatedDividendByStock].sort(
      (a, b) => (b.current_amount || 0) - (a.current_amount || 0),
    );
  }, [estimatedDividendByStock]);

  // Prepare bar chart data with proper formatting to ensure correct y-axis values and stack heights
  const prepareBarChartData = useMemo(() => {
    if (
      barChartNavItems.length > 0 &&
      estimatedDividendAll[barChartNavItems[currentNavItemIndex]]
    ) {
      const chartData =
        estimatedDividendAll[barChartNavItems[currentNavItemIndex]];

      // Remove total property but keep the rest of the data
      const { total, ...rest } = chartData;

      // Convert data values to numbers
      const numericData = rest.data.map((value) => Number(value));

      // Calculate the maximum value for proper y-axis scaling
      const maxValue = Math.max(...numericData);

      // Calculate appropriate y-axis intervals
      // Round up to nearest multiple of 10 and add some buffer
      const roundedMax = Math.ceil(maxValue / 10) * 10;
      const yAxisMax = Math.max(roundedMax + 10, 50); // At least 50 or higher

      // Calculate appropriate intervals (5-6 steps is usually good for readability)
      const interval = Math.ceil(yAxisMax / 5 / 10) * 10;

      // Ensure the data is properly formatted for the bar chart
      return {
        ...rest,
        // Make sure data values are properly passed as numbers
        data: numericData,
        // Ensure unit is set for y-axis display
        unit: "원",
        // Force y-axis configuration
        yAxis: {
          max: yAxisMax,
          interval: interval,
          type: "value",
          axisLabel: {
            formatter: "{value}원",
          },
        },
      };
    }

    return {
      xAxises: [],
      data: [],
      unit: "원",
      total: 0,
      yAxis: {
        max: 50,
        interval: 10,
        type: "value",
        axisLabel: {
          formatter: "{value}원",
        },
      },
    };
  }, [barChartNavItems, currentNavItemIndex, estimatedDividendAll]);

  return (
    <div
      className={`relative ${selectedTab === "모두" ? "h-[390px]" : "h-full"} w-full rounded-xl border border-gray-20 bg-white p-[16px] mobile:rounded-none ${selectedTab === "모두" ? "mobile:h-[500px]" : "h-full min-h-[388px]"} mobile:border-none`}
    >
      <header className="flex flex-col except-mobile:flex-row except-mobile:items-center">
        <h2 className="flex flex-row items-center gap-1 text-heading-2 text-gray-80">
          <span className="text-nowrap">예상 배당액</span>
          <TooltipWithIcon text="예상 추정치로 실제 배당금과 다를 수 있습니다. 최근 2년간 배당을 지급한 주식만 예상 배당액에 포함하였습니다." />
        </h2>
        <div className="mt-[16px] flex w-full justify-between except-mobile:mt-0">
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
      </header>
      {selectedTab === "모두" &&
        estimatedDividendAll[barChartNavItems[currentNavItemIndex]]?.xAxises
          .length !== 0 && (
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
                      ?.total as number
                  )?.toFixed(0),
                ).toLocaleString("ko-KR")}
              </p>
            </div>
          </>
        )}

      <div
        className={`${selectedTab === "모두" ? "h-[217px]" : "h-full"} w-full`}
      >
        {selectedTab === "모두" &&
        estimatedDividendAll[barChartNavItems[currentNavItemIndex]]?.xAxises
          .length !== 0 ? (
          <BarChart chartData={prepareBarChartData} />
        ) : (
          <div className={`${selectedTab === "종목별" && "hidden"}`}>
            <NoDataMessage />
          </div>
        )}
        {selectedTab === "종목별" && sortedDividendByStock[0].name !== "" ? (
          <div className="pt-[41px]">
            <DonutChart chartName="예상 배당액" data={sortedDividendByStock} />
          </div>
        ) : (
          <div className={`${selectedTab === "모두" && "hidden"}`}>
            <NoDataMessage />
          </div>
        )}
      </div>
    </div>
  );
}
