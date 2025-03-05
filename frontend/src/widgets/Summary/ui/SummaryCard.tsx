import Card from "@/shared/ui/Card";
import PriceDisplay from "@/shared/ui/PriceDisplay";
import { IncDecRate } from "@/shared";
import { commaizeNumber } from "@toss/utils";

interface SummaryCardProps {
  title?: string;
  amount?: number;
  rate?: number;
}

const titleToolTipMsgMap = {
  "나의 총 자산": "매수 기준으로 계산됩니다.",
  "나의 투자 금액": "매수 기준으로 계산됩니다.",
  수익금:
    "매수 기준으로만 계산되며 예상 추정치로 실제 수익률과 다를 수 있습니다.",
};

const checkIsNeedTooltip = (title: string) => {
  return Object.keys(titleToolTipMsgMap).includes(title);
};

const getTooltipMsg = (title: string) => {
  return titleToolTipMsgMap[title] ?? "";
};

export default function SummaryCard({ title, amount, rate }: SummaryCardProps) {
  return (
    <div className="w-1/4 mobile:w-full mobile:shrink-0">
      <Card
        title={title}
        height="100px"
        withTooltip={checkIsNeedTooltip(title ?? "")}
        tooltipText={getTooltipMsg(title ?? "")}
      >
        <div className="flex items-center">
          {title !== "지난 달 보다" ? (
            <PriceDisplay price={amount} />
          ) : (
            <div className="flex w-full items-center space-x-[8px] overflow-hidden">
              <span
                className={`w-full overflow-hidden truncate text-[28px] font-bold leading-[33.6px] text-alert ${amount === 0 && "text-gray-100"} ${amount && amount > 0 && "text-alert"} ${amount && amount < 0 && "text-decrease"}`}
              >
                {amount && amount > 0 ? "+" : amount && amount < 0 ? "-" : ""}₩
                {commaizeNumber(Math.abs(amount ?? 0).toFixed(0) ?? "0")}
              </span>
            </div>
          )}
          {title === "수익금" && (
            <IncDecRate rate={rate || 0} className={"ml-[16px]"} />
          )}
        </div>
      </Card>
    </div>
  );
}
