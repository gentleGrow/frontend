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
    <div className="flex flex-col justify-center space-y-[12px] border-r border-gray-20 px-[16px] text-heading-4">
      <p className="">{stockMarket}</p>
      <div className="flex items-center space-x-[8px]">
        <p>{stockIndex}</p>
        <IncDecRate rate={rate} />
      </div>
    </div>
  );
}
