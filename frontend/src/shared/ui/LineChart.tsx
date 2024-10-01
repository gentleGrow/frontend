"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { LineChartData } from "../types/charts";

export default function LineChart({
  data,
  type,
}: {
  data: LineChartData;
  type: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const chartInstance = echarts.init(chartRef.current);

      const setOption = () => {
        const isSmallScreen = window.innerWidth <= 840;

        const option = {
          title: {
            text: `(${data.unit})`,
            left: isSmallScreen ? "3%" : -6,
            top: "5%",
            textStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#2A2D31",
            },
          },
          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              const date = data.dates[params[0].dataIndex];
              const myReturn = Number(params[0].data.toFixed(2)).toLocaleString(
                "ko-KR",
              );
              const kospi = Number(params[1].data.toFixed(2)).toLocaleString(
                "ko-KR",
              );
              return `
                <div style="width:137px; height:70px; display:flex; flex-direction: column; ">
                  <div style="font-size:12px;margin-bottom:2px;color:#4F555E;">${date}</div>
                  <div style="display:flex;align-items:center;font-size:12px;margin-bottom:2px;">
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="3" width="16" height="2" rx="1" fill="#0B99FF"/>
                      <g filter="url(#filter0_d_1862_2295)">
                        <circle cx="8" cy="4" r="3" fill="#0B99FF"/>
                        <circle cx="8" cy="4" r="2.5" stroke="white"/>
                      </g>
                    </svg>
                    <span style="margin-left:8px; color:#2A2D31;">${data.values1.name} </span>
                    <span style="display:block; width:100%; text-align:right; font-weight:bold;color:#0B99FF;margin-left:4px;">${myReturn}${data.unit}</span>
                  </div>
                  <div style="display:flex;align-items:center;font-size:12px;margin-bottom:2px;">
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="3" width="16" height="2" rx="1" fill="#4460F1"/>
                      <g filter="url(#filter0_d_1862_2295)">
                        <circle cx="8" cy="4" r="3" fill="#4460F1"/>
                        <circle cx="8" cy="4" r="2.5" stroke="white"/>
                      </g>
                    </svg>
                    <span style="margin-left:8px; color:#2A2D31;">${data.values2.name}</span>
                    <span style="display:block; width:100%; text-align:right; font-weight:bold;color:#4460F1;margin-left:4px;">${kospi}${data.unit}</span>
                  </div>
                </div>
              `;
            },
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "transparent",
            textStyle: {
              color: "#2A2D31",
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: data.xAxises,
            axisLabel: {
              interval:
                type === "fiveDayPerformanceData"
                  ? isSmallScreen
                    ? 95
                    : 47
                  : type === "monthlyPerformanceData"
                    ? isSmallScreen
                      ? 13
                      : 6
                    : type === "threeMonthPerformanceData"
                      ? isSmallScreen
                        ? 1
                        : 0
                      : type === "sixMonthPerformanceData"
                        ? isSmallScreen
                          ? 1.5
                          : 0
                        : type === "yearlyPerformanceData"
                          ? isSmallScreen
                            ? 2
                            : 0
                          : "auto",
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",

            axisLabel: {
              margin: 15,
            },
          },
          grid: {
            left: isSmallScreen ? "15px" : "0",
            right: isSmallScreen ? "15px" : "15px",
            bottom: 32,
            containLabel: true,
          },
          series: [
            {
              name: data.values1.name,
              type: "line",
              data: data.values1.values,
              showSymbol: false,
              symbolSize: 8,
              itemStyle: {
                color: "#0B99FF",
              },
              lineStyle: {
                color: "#0B99FF",
                width: 2,
              },
              emphasis: {
                focus: "series",
                showSymbol: true,
                symbol: "circle",
                symbolSize: 8,
              },
            },
            {
              name: data.values2.name,
              type: "line",
              data: data.values2.values,
              showSymbol: false,
              symbolSize: 8,
              itemStyle: {
                color: "#4460F1",
              },
              lineStyle: {
                color: "#4460F1",
                width: 2,
              },
              emphasis: {
                focus: "series",
                showSymbol: true,
                symbol: "circle",
                symbolSize: 8,
              },
            },
          ],
          legend: {
            itemGap: 48,
            data: [{ name: data.values1.name }, { name: data.values2.name }],
            bottom: 0,
            textStyle: {
              color: "#2A2D31",
            },
            icon: "path://M2,2 h8.4 a0.5,0.5 0 0 1 0.5,0.5 v1 a0.5,0.5 0 0 1 -0.5,0.5 h-8.4 a0.5,0.5 0 0 1 -0.5,-0.5 v-1 a0.5,0.5 0 0 1 0.5,-0.5 z",
          },
        };

        chartInstance.setOption(option);
      };

      setOption();

      const handleResize = () => {
        setOption();
        chartInstance.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.dispose();
      };
    }
  }, [data]);

  return (
    <div
      ref={chartRef}
      className="h-[328px] w-full pb-[16px] mobile:pr-[16px]"
    />
  );
}
