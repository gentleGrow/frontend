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
    <div className="mx-auto max-w-[1400px] bg-gray-5 p-[20px]">
      <div className="mb-[20px] flex space-x-[16px]">
        <div className="w-7/12">
          <DailyInvestmentTip />
        </div>
        <div className="w-5/12">
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
