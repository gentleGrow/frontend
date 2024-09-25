import {
  DailyInvestmentTip,
  EstimateDividend,
  ExplorePortfolio,
  InvestmentPerformanceChart,
  MarketIndex,
  MyStocks,
  RichPortfolio,
  StockComposition,
  Summary,
  Top10SelectedByRichPerson,
} from "@/widgets";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-[16px] bg-gray-5 p-[20px] mobile:p-0">
      <DailyInvestmentTip />
      <MarketIndex />
      <Summary />
      <div className="flex w-full space-x-[16px] mobile:flex-col mobile:space-x-0 mobile:space-y-[16px]">
        <div className="w-5/12 mobile:w-full">
          <StockComposition />
        </div>
        <div className="w-7/12 mobile:w-full">
          <InvestmentPerformanceChart />
        </div>
      </div>
      <Top10SelectedByRichPerson />

      <MyStocks />

      <div className="pt-12">
        <EstimateDividend />
      </div>
      <RichPortfolio />
      <ExplorePortfolio />
    </div>
  );
}
