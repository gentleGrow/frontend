import Card from "@/shared/ui/Card";
import PriceDisplay from "@/shared/ui/PriceDisplay";
import { IncDecRate } from "@/shared";

interface SummaryCardProps {
  title?: string;
  type?: string;
  amount?: number;
  rate?: number;
}

export default function SummaryCard({ title, amount, rate }: SummaryCardProps) {
  return (
    <div className="w-1/4 mobile:w-full mobile:shrink-0">
      <Card title={title} height="100px">
        <div className="flex items-center">
          {amount && title !== "오늘의 review" ? (
            <PriceDisplay price={amount} />
          ) : (
            <div className="flex items-center space-x-[8px]">
              <p className="except-web:text-[20px] [1400px]:bg-red font-bold leading-[24px] except-mobile:text-[1.42vw]">
                지난 달 보다
              </p>

              <span
                className={`except-web:text-[28px] font-bold leading-[33.6px] text-alert except-mobile:text-[2vw] ${amount === 0 && "text-gray-100"} ${amount && amount > 0 && "text-alert"} ${amount && amount < 0 && "text-decrease"}`}
              >
                {amount && amount > 0 ? "+" : amount && amount < 0 ? "-" : ""}
                {amount?.toFixed(2)}%
              </span>
            </div>
          )}

          {rate && <IncDecRate rate={rate} className={"ml-[16px]"} />}
        </div>
      </Card>
    </div>
  );
}
