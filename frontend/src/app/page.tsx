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
import FinishDeactivatedDialog from "@/widgets/deactivate-widget/ui/FinishDeactivatedDialog";
import JoinDialog from "@/widgets/join-dialog/ui/JoinDialog";
import { Suspense } from "react";
import { UserFeedbackButton } from "@/features/user-feedback";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col gap-[32px] bg-gray-5">
      <div className="space-y-[16px] px-[20px] pt-[20px] mobile:p-0">
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
        <div className="flex space-x-[16px] mobile:flex-col mobile:space-x-0 mobile:space-y-[16px]">
          <div className="w-1/2 mobile:w-full">
            <EstimateDividend />
          </div>
          <div className="w-1/2 mobile:w-full">
            <MyStocks />
          </div>
        </div>
        <div className="flex space-x-[16px] mobile:flex-col mobile:space-x-0 mobile:space-y-[16px]">
          <div className="w-4/12 mobile:w-full">
            <Top10SelectedByRichPerson />
          </div>
          <div className="w-8/12 space-y-[16px] mobile:w-full">
            <RichPortfolio />
            <ExplorePortfolio />
          </div>
        </div>
        <Suspense>
          <FinishDeactivatedDialog />
        </Suspense>
        <JoinDialog />
      </div>
      <UserFeedbackButton />
    </div>
  );
}
