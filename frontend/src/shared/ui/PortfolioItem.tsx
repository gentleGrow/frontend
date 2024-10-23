"use client";
import DonutChart from "./DonutChart";

export default function PortfolioItem({
  item,
  chartName,
  isRichPortfolio,
}: {
  item: any;
  chartName: string;
  isRichPortfolio?: boolean;
}) {
  return (
    <div className="h-[218px] shrink-0">
      <div className="h-full rounded-lg border border-gray-10 p-[16px]">
        <div className="flex items-center space-x-1">
          <h3 className="mb-[15px] truncate text-body-3 text-gray-100">
            {item.name}
          </h3>
          {isRichPortfolio && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.72583 2.72583L8 0.541196L13.2742 2.72583L15.4588 8L13.2742 13.2742L8 15.4588L2.72583 13.2742L0.541196 8L2.72583 2.72583Z"
                fill="#05D665"
              />
              <path
                d="M2.72583 2.72583L8 0.541196L13.2742 2.72583L15.4588 8L13.2742 13.2742L8 15.4588L2.72583 13.2742L0.541196 8L2.72583 2.72583Z"
                stroke="#05D665"
                style={{ mixBlendMode: "screen" }}
              />
              <path
                d="M6.83058 11.4086L6.91897 11.497L7.00736 11.4086L12.8601 5.55586L12.9485 5.46747L12.8601 5.37909L12.0733 4.59228L11.9849 4.50389L11.8965 4.59228L6.91897 9.56984L4.64693 7.2978L4.55854 7.20941L4.47015 7.2978L3.68334 8.08461L3.59495 8.173L3.68334 8.26138L6.83058 11.4086Z"
                fill="white"
                stroke="white"
                stroke-width="0.25"
              />
            </svg>
          )}
        </div>
        <DonutChart data={item.data} chartName={chartName} isPortfolio={true} />
      </div>
    </div>
  );
}
