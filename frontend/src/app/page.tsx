import {
  DailyInvestmentTip,
  MarketIndex,
  Top10SelectedByRichPerson,
} from "@/widgets";

export default function Home() {
  return (
    <>
      <DailyInvestmentTip />
      <MarketIndex />
      <Top10SelectedByRichPerson />
    </>
  );
}
