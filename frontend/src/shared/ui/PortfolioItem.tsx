"use client";
import DonutChart from "./DonutChart";

export default function PortfolioItem({ item, chartName }) {
  return (
    <div className="h-[218px] shrink-0">
      <div className="h-full rounded-lg border border-gray-10 p-[16px]">
        <h3 className="mb-[15px] truncate text-body-3">{item.name}</h3>
        <DonutChart data={item.data} chartName={chartName} isPortfolio={true} />
      </div>
    </div>
  );
}
