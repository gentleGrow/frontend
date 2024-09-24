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
    <div className="flex justify-center space-x-[24px] border-r border-gray-20 text-heading-4 mobile:flex-col mobile:space-x-0 mobile:space-y-[12px] mobile:px-[16px] except-mobile:items-center except-mobile:border-r-0">
      <p className="">{stockMarket}</p>
      <div className="flex items-center space-x-[8px]">
        <p>{stockIndex}</p>
        <IncDecRate rate={rate} />
      </div>
    </div>
  );
}
