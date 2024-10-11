// pages/asset/overview/page.tsx

import { InvestmentPerformanceChart, StockComposition } from "@/widgets";
import { Suspense } from "react";

const Overview = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 except-mobile:flex-row">
        <Suspense fallback={<div>종목 구성 로딩</div>}>
          <StockComposition />
        </Suspense>
        <Suspense fallback={<div>투자 성과 로딩</div>}>
          <InvestmentPerformanceChart />
        </Suspense>
      </div>
    </div>
  );
};

export default Overview;
