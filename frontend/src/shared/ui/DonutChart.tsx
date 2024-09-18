"use client";
import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { DonutChartData } from "../types/charts";

export default function DonutChart({
  chartName,
  data,
}: {
  chartName: string;
  data: DonutChartData[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const totalCurrentAmount = data.reduce(
        (sum, item) => sum + item.current_amount,
        0,
      );

      const setOption = () => {
        const isMobile = window.matchMedia("(max-width: 840px)").matches;
        const gap = 56;
        const legendWidth = 174;

        const containerWidth =
          chartRef.current?.offsetWidth || window.innerWidth;

        const seriesRadius = 128;

        const seriesWidth = seriesRadius * 2;

        const totalContentWidth = seriesWidth + gap + legendWidth;

        const leftMargin = (containerWidth - totalContentWidth) / 2;

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
            formatter: (params) => {
              return `<span style="font-size:12px; line-height:18px; color:#2A2D31"> ${params.name} · <span style="font-weight:bold">${params.percent}</span>%<br/><span style="font-weight:bold">₩${params.value.toLocaleString(
                "ko-KR",
              )}원</span></span>`;
            },
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "transparent",
            textStyle: {
              color: "#2A2D31",
            },
            position: function (point, params, dom, rect, size) {
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
            left: isMobile ? "center" : leftMargin + seriesWidth + gap,
            top: isMobile ? "bottom" : "middle",
            formatter: (name) => {
              const item = data.find((i) => i.name === name);
              const percent = item
                ? (item.current_amount / totalCurrentAmount) * 100
                : 0;

              const maxNameLength = isMobile
                ? Math.floor((window.innerWidth - 64 - 70) / 8)
                : 10;
              const formattedName =
                name.length > maxNameLength
                  ? name.substring(0, maxNameLength) + "..."
                  : name;

              return `{name|${formattedName}}{space|} {percent|${percent.toFixed(
                2,
              )}%}`;
            },

            textStyle: {
              rich: {
                name: {
                  width: isMobile ? window.innerWidth - 64 - 70 : 84,
                },
                space: {
                  width: 24,
                },
                percent: {
                  align: "right",
                  width: 40,
                  fontWeight: "bold",
                },
              },
            },
          },
          series: [
            {
              name: chartName,
              type: "pie",
              radius: ["64px", "128px"],
              center: isMobile
                ? ["50%", "128px"]
                : [leftMargin + seriesRadius, "50%"],
              left: "0",
              right: isMobile ? "0" : "0",
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
        setOption();
        chartInstance.resize();
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.dispose();
      };
    }
  }, [data, windowWidth]);

  const chartHeight = 276 + data.length * 25;
  const maxHeight = windowWidth > 840 ? 256 : chartHeight;

  return <div ref={chartRef} style={{ height: `${maxHeight}px` }} />;
}
