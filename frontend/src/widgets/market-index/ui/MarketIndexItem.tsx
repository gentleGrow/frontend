import { IncDecRate } from "@/shared";

export default function MarketIndexItem({
  stockMarket,
  stockIndex,
  rate,
}: {
  stockMarket: string;
  stockIndex: number;
  rate: number;
}) {
  return (
    <div className="flex shrink-0 items-center justify-center space-x-[24px] text-heading-4">
      <p>{stockMarket}</p>
      <div className="flex items-center space-x-[8px]">
        <p>{stockIndex}</p>
        <IncDecRate rate={rate} />
      </div>
    </div>
  );
}
