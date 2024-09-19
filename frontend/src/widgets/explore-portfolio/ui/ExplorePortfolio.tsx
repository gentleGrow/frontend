import { DonutChart } from "@/shared";
const data = [
  {
    name: "Apple Inc.",
    percent_rate: 10.21730249495361,
    current_amount: 1799593.1142956542,
  },
  {
    name: "Microsoft Corporation",
    percent_rate: 35.62637294339039,
    current_amount: 6274941.499277343,
  },
  {
    name: "Amazon.com, Inc.",
    percent_rate: 4.207139030583358,
    current_amount: 741011.4787207032,
  },
  {
    name: "Alphabet Inc. (Class A)",
    percent_rate: 4.809233792588008,
    current_amount: 847059.5856835938,
  },
  {
    name: "Tesla, Inc.",
    percent_rate: 8.539708199664812,
    current_amount: 1504115.2086669924,
  },
  {
    name: "Meta Platforms, Inc.",
    percent_rate: 24.270844663933026,
    current_amount: 4274870.491201172,
  },
  {
    name: "NVIDIA Corporation",
    percent_rate: 5.958571144452672,
    current_amount: 1049494.5811669922,
  },
  {
    name: "Schwab U.S. Dividend Equity ETF",
    percent_rate: 6.370827730434112,
    current_amount: 1122106.1255371093,
  },
];
export default function ExplorePortfolio() {
  return (
    <div className="p-[16px]">
      <h2 className="text-heading-2">포트폴리오 구경하기</h2>
      <div className="w-1/4 border">
        <div className="h-[203px]">
          <DonutChart
            data={data}
            chartName="포트폴리오 구경"
            isPortfolio={true}
          />
        </div>
      </div>
    </div>
  );
}
