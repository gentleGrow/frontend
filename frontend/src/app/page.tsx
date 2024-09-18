import {
  DailyInvestmentTip,
  EstimateDividend,
  InvestmentPerformanceChart,
  MarketIndex,
  MyStocks,
  StockComposition,
  Top10SelectedByRichPerson,
} from "@/widgets";

export default function Home() {
  return (
    <>
      <DailyInvestmentTip />
      <MarketIndex />
      <Top10SelectedByRichPerson />
      <MyStocks />
      <StockComposition />
      <InvestmentPerformanceChart />
      <div className="pt-12">
        <EstimateDividend />
      </div>
    </>
  );
}
