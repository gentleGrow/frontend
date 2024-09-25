"use client";
import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { DonutChartData } from "../types/charts";

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
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const totalCurrentAmount = data.reduce(
        (sum, item) => sum + item.current_amount,
        0,
      );

      const setOption = () => {
        const isMobile =
          isPortfolio || window.matchMedia("(max-width: 840px)").matches;
        const gap = 56;
        const legendWidth = isMobile ? window.innerWidth * 0.6 : 174;

        const containerWidth =
          chartRef.current?.offsetWidth || window.innerWidth;

        // 동적 반지름 계산: containerWidth에 비례하여 도넛 크기를 조절
        const maxRadius = 128; // 최대 반지름 (px)
        const minRadius = 54; // 최소 반지름 (px)

        // 동적 반지름 설정, containerWidth에 따라 조절
        const dynamicRadius = Math.max(
          minRadius,
          Math.min(containerWidth / 4, maxRadius),
        );

        const seriesOuterRadius = isMobile
          ? isPortfolio
            ? 54
            : dynamicRadius
          : dynamicRadius;
        const seriesInnerRadius = seriesOuterRadius / 2;

        const seriesWidth = seriesOuterRadius * 2;
        const totalContentWidth = seriesWidth + gap + legendWidth;

        const leftMargin = Math.max(
          (containerWidth - totalContentWidth) / 2,
          0,
        );

        const legendData = isPortfolio
          ? data.slice(0, 2).map((item) => item.name)
          : data.map((item) => item.name);

        let maxNameLength;
        if (isPortfolio) {
          const nameMaxWidth = containerWidth > 60 ? containerWidth - 60 : 84;
          maxNameLength = Math.floor((nameMaxWidth - 60) / 5);
        } else if (isMobile) {
          maxNameLength = Math.floor((containerWidth - 64 - 70) / 5);
        } else {
          maxNameLength = 10;
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
            formatter: (params: any) => {
              return `<span style="font-size:12px; line-height:18px; color:#2A2D31"> ${
                params.name
              } · <span style="font-weight:bold">${params.percent}</span>%<br/><span style="font-weight:bold">₩${params.value.toLocaleString(
                "ko-KR",
              )}원</span></span>`;
            },
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "transparent",
            textStyle: {
              color: "#2A2D31",
            },
            position: function (
              point: any,
              params: any,
              dom: any,
              rect: any,
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
              isMobile || isPortfolio
                ? "center"
                : leftMargin + seriesWidth + gap,
            right: isMobile || isPortfolio ? 0 : undefined,
            top: isMobile ? "bottom" : "middle",
            data: legendData,
            padding: isMobile || isPortfolio ? [0, 10] : [0, 0],
            formatter: (name: string) => {
              const item = data.find((i) => i.name === name);
              const percent = item
                ? (item.current_amount / totalCurrentAmount) * 100
                : 0;

              const formattedName =
                name.length > maxNameLength
                  ? name.substring(0, maxNameLength) + "..."
                  : name;

              if (isPortfolio) {
                return `{name|${formattedName}}{percent|${percent.toFixed(
                  2,
                )}%}`;
              } else {
                return `{name|${formattedName}}{space|} {percent|${percent.toFixed(
                  2,
                )}%}`;
              }
            },
            textStyle: {
              rich: {
                name: {
                  width: isPortfolio
                    ? containerWidth > 60
                      ? containerWidth - 60
                      : 84
                    : isMobile
                      ? window.innerWidth - 64 - 70
                      : 84,
                  align: "left",
                },
                space: {
                  width: 24,
                },
                percent: {
                  align: "right",
                  width: 20,
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
              data: data.map((item) => ({
                value: item.current_amount,
                name: item.name,
              })),
            },
          ],
        };

        chartInstance.setOption(option);
      };

      setOption();

      const handleResize = () => {
        setTimeout(() => {
          setOption();
          chartInstance.resize();
          setWindowWidth(window.innerWidth);
        }, 100); // 리사이즈 이벤트를 조금 지연시킴
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.dispose();
      };
    }
  }, [data, windowWidth, isPortfolio]);

  const chartHeight = isPortfolio ? 128 + 2 * 25 : 276 + data.length * 25;
  const maxHeight = isPortfolio
    ? chartHeight
    : windowWidth > 840
      ? 256
      : chartHeight;

  return (
    <div
      ref={chartRef}
      style={{ height: `${maxHeight}px`, overflow: "hidden" }}
    />
  );
}