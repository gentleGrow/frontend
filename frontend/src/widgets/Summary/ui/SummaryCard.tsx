import Card from "@/shared/ui/Card";
import PriceDisplay from "@/shared/ui/PriceDisplay";
import { IncDecRate } from "@/shared";
import { commaizeNumber } from "@toss/utils";

interface SummaryCardProps {
  title?: string;
  amount?: number;
  rate?: number;
}

export default function SummaryCard({ title, amount, rate }: SummaryCardProps) {
  return (
    <div className="w-1/4 mobile:w-full mobile:shrink-0">
      <Card title={title} height="100px">
        <div className="flex items-center">
          {title !== "지난 달 보다" ? (
            <PriceDisplay price={amount} />
          ) : (
            <div className="flex items-center space-x-[8px]">
              <span
                className={`text-heading-1 text-alert ${amount === 0 && "text-gray-100"} ${amount && amount > 0 && "text-alert"} ${amount && amount < 0 && "text-decrease"}`}
              >
                {amount && amount > 0 && "+"}₩
                {commaizeNumber(amount?.toFixed(0) ?? "0")}
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
