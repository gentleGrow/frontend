"use client";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";

interface DonutChartData {
  value: number;
  name: string;
  percent: number;
}

export default function DonutChart({
  chartName,
  data,
}: {
  chartName: string;
  data: DonutChartData[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const totalValue = data.reduce((sum, item) => sum + item.value, 0);

      const setOption = () => {
        const isMobile = window.matchMedia("(max-width: 840px)").matches;

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
            right: isMobile ? "center" : 14,
            top: isMobile ? "bottom" : "center",
            formatter: (name) => {
              const item = data.find((i) => i.name === name);
              const percent = item ? (item.value / totalValue) * 100 : 0;

              const maxNameLength = isMobile
                ? Math.floor((window.innerWidth - 64 - 70) / 8)
                : 10;
              const formattedName =
                name.length > maxNameLength
                  ? name.substring(0, maxNameLength) + "..."
                  : name;

              return `{name|${formattedName}}{space|} {percent|${percent.toFixed(2)}%}`;
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
              center: isMobile ? ["50%", "27%"] : ["128px", "50%"],
              left: "0",
              right: isMobile ? "0" : "200px",
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
              data,
            },
          ],
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

  return <div ref={chartRef} className="h-[256px] mobile:h-[520px]" />;
}
