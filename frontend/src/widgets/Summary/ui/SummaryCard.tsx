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
    <div className="w-1/4">
      <Card title={title} height="100px">
        <div className="flex items-center">
          {amount && title !== "오늘의 review" ? (
            <PriceDisplay price={amount} />
          ) : (
            <div className="flex items-center space-x-[8px]">
              <p className="except-web:text-[20px] [1400px]:bg-red text-[1.42vw] font-bold leading-[24px]">
                지난 달 보다
              </p>
              <span className="except-web:text-[28px] text-[2vw] font-bold leading-[33.6px] text-alert">
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
