"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { DonutChartData } from "../types/charts";
import { commaizeNumber } from "@toss/utils";
import { ceil } from "es-toolkit/compat";

export default function DonutChart({
  chartName,
  data,
  isPortfolio = false,
}: {
  chartName: string;
  data: DonutChartData[];
  isPortfolio?: boolean;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalCurrentAmount = isPortfolio
    ? 0
    : data?.reduce((sum, item) => sum + (item?.current_amount ?? 0), 0);
  const setOption = useCallback(() => {
    const isMobile =
      isPortfolio || window.matchMedia("(max-width: 1024px)").matches;
    const gap = 56;
    const legendWidth = isMobile ? window.innerWidth * 0.7 : 200;

    const containerWidth = chartRef.current?.offsetWidth || window.innerWidth;

    const maxRadius = 128;
    const minRadius = 0;

    const dynamicRadius = Math.max(
      minRadius,
      Math.min((containerWidth - 56) / 4, maxRadius),
    );

    const seriesOuterRadius = isMobile
      ? isPortfolio
        ? 52
        : dynamicRadius
      : dynamicRadius;
    const seriesInnerRadius = seriesOuterRadius / 2;

    const seriesWidth = seriesOuterRadius * 2;
    const totalContentWidth = seriesWidth + gap + legendWidth;

    const leftMargin = Math.max((containerWidth - totalContentWidth) / 2, 0);

    const legendData = isPortfolio
      ? data?.slice(0, 2).map((item) => item.name)
      : data?.map((item) => item.name);

    let maxNameLength;
    if (isPortfolio) {
      const nameMaxWidth = containerWidth > 60 ? containerWidth - 60 : 84;
      maxNameLength = Math.floor((nameMaxWidth - 60) / 5);
    } else if (isMobile) {
      maxNameLength = Math.floor((containerWidth - 64 - 70 - 24) / 5);
    } else {
      maxNameLength = containerWidth < 390 ? 10 * (containerWidth / 390) : 10;
    }

    const option = {
      color: [
        "#05D665",
        "#62E59E",
        "#C3F5DA",
        "#0B99FF",
        "#59C4FF",
        "#95D9FF",
        "#4460F1",
        "#7392FF",
        "#AFC0FF",
        "#D8DADC",
      ],

      tooltip: {
        trigger: "item",
        confine: true,
        extraCssText: "box-shadow: 1px 1px 4px 2px #00000033;",
        padding: 0,
        formatter: (params: any) => {
          return `
<div class="px-2 py-1.5 flex flex-col">
  <div class="flex flex-row gap-1 items-center flex-nowrap">
    <span class="text-[12px] leading-[18px] text-gray-100 font-normal">${params.name}</span> 
    <span class="w-0.5 h-0.5 bg-gray-100" ></span>
    <span class="text-[12px] leading-[18px] text-gray-100 font-semibold">${params.percent}%</span>
  </div>
  <div class="text-[12px] font-semibold leading-[18px]">₩${commaizeNumber(ceil(params.value))}원</div>
</div>`;
        },
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "transparent",
        textStyle: {
          color: "#2A2D31",
        },
        position: function (
          point: any,
          _params: any,
          _dom: any,
          _rect: any,
          size: any,
        ) {
          const x = point[0];
          const y = point[1];

          const tooltipHeight = size.contentSize[1];

          return [x + 10, y - tooltipHeight - 10];
        },
      },

      legend: {
        icon: "path://M4,2 h12 a2,2 0 0 1 2,2 v12 a2,2 0 0 1 -2,2 h-12 a2,2 0 0 1 -2,-2 v-12 a2,2 0 0 1 2,-2 z",
        itemWidth: 12,
        itemHeight: 12,
        orient: isMobile ? "horizontal" : "vertical",
        left:
          isMobile || isPortfolio ? "center" : leftMargin + seriesWidth + gap,
        right: isMobile || isPortfolio ? 0 : undefined,
        top: isMobile ? "bottom" : "middle",
        data: legendData,
        padding: isMobile || isPortfolio ? [0, 0] : [0, 0],
        formatter: (name: string) => {
          const item = data?.find((i) => i.name === name);
          const percent = isPortfolio
            ? item?.percent_ratio
            : ((item?.current_amount ?? 0) / totalCurrentAmount) * 100;

          const formattedName =
            name.length > maxNameLength
              ? name.substring(0, maxNameLength) + "..."
              : name;

          if (isPortfolio) {
            return `{name|${formattedName}}{percent|${percent?.toFixed(0)}%}`;
          } else {
            return `{name|${formattedName}}{space|} {percent|${percent?.toFixed(
              2,
            )}%}`;
          }
        },
        textStyle: {
          rich: {
            name: {
              width: isPortfolio
                ? containerWidth > 60
                  ? containerWidth - 38
                  : 84
                : isMobile
                  ? window.innerWidth - 64 - 70 - 24
                  : containerWidth < 390
                    ? 84 * (containerWidth / 390)
                    : 100,
              align: "left",
              overflow: "truncate",
              ellipsis: "...",
            },
            space: {
              width: 24,
            },
            percent: {
              align: "right",
              width:
                !isMobile && !isPortfolio && containerWidth < 390
                  ? 30 * (containerWidth / 390)
                  : 30,
              fontWeight: "bold",
            },
          },
        },
      },
      series: [
        {
          name: chartName,
          type: "pie",
          radius: [`${seriesInnerRadius}px`, `${seriesOuterRadius}px`],
          center: isMobile
            ? isPortfolio
              ? ["50%", "64px"]
              : ["50%", "128px"]
            : [leftMargin + seriesOuterRadius, "50%"],
          left: "0",
          right: "0",
          top: 0,
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          labelLine: {
            show: false,
          },
          data: data
            ?.map((item) => ({
              value: isPortfolio ? item.percent_ratio : item.current_amount,
              name: item.name,
            }))
            .toSorted((a, b) => (a?.value ?? 0) - (b?.value ?? 0)),
        },
      ],
    };

    chartInstanceRef.current?.setOption(option);
  }, [data, chartName, isPortfolio, totalCurrentAmount]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    if (chartRef.current) {
      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }

      setOption();

      const handleResize = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          setOption();
          chartInstanceRef.current?.resize();
          setWindowWidth(window.innerWidth);
        }, 300);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstanceRef.current?.dispose();
        chartInstanceRef.current = null;
      };
    }
  }, [data, windowWidth, isPortfolio, setOption]);

  const chartHeight = isPortfolio
    ? 128 + 2 * 25 - 25 + 16
    : 276 + data?.length * 25 + 16;
  const maxHeight = isPortfolio
    ? chartHeight
    : windowWidth > 1024
      ? 256
      : chartHeight;

  return (
    <div
      ref={chartRef}
      style={{ height: `${maxHeight}px` }}
      id="echartDonutCanvas"
    />
  );
}
