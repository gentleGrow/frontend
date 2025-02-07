import {
  EstimateDividend,
  InvestmentPerformanceChart,
  StockComposition,
  Summary,
} from "@/widgets";
import AssetsAccumulateTrend from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrend";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오 개요",
  description:
    "한눈에 보는 나의 투자 현황. 자산 분배, 수익률, 투자 추이를 직관적인 차트로 확인하세요.",
  openGraph: {
    title: "포트폴리오 개요 | 올라스",
    description:
      "한눈에 보는 나의 투자 현황. 자산 분배, 수익률, 투자 추이를 직관적인 차트로 확인하세요.",
  },
};

const Overview = async () => {
  return (
    <div className="flex flex-col gap-4">
      <Summary />
      <div className="grid grid-cols-1 gap-4 except-mobile:grid-cols-5">
        <div className="except-mobile:col-span-2">
          <StockComposition />
        </div>
        <div className="except-mobile:col-span-3">
          <InvestmentPerformanceChart />
        </div>
      </div>
      <div className="grid-cols grid grid-cols-1 gap-4 except-mobile:grid-cols-2">
        <AssetsAccumulateTrend />
        <EstimateDividend />
      </div>
    </div>
  );
};

export default Overview;
