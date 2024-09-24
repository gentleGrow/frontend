import {
  DailyInvestmentTip,
  EstimateDividend,
  ExplorePortfolio,
  InvestmentPerformanceChart,
  MarketIndex,
  MyStocks,
  RichPortfolio,
  StockComposition,
  Top10SelectedByRichPerson,
} from "@/widgets";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] bg-gray-5 p-[20px] mobile:p-0">
      <div className="mb-[20px] flex flex-col space-y-[16px]">
        <div className="w-full">
          <DailyInvestmentTip />
        </div>
        <div className="w-full">
          <MarketIndex />
        </div>
      </div>

      <Top10SelectedByRichPerson />
      <MyStocks />
      <StockComposition />
      <InvestmentPerformanceChart />
      <div className="pt-12">
        <EstimateDividend />
      </div>
      <RichPortfolio />
      <ExplorePortfolio />
    </div>
  );
}
