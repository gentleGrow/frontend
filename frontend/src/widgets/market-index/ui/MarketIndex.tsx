"use client";

import MarketIndexItem from "./MarketIndexItem";
import VerticalTicker from "./VerticalTicker";
const items = [
  { stockMarket: "코스피", stockIndex: 192.8, rate: 10 },
  { stockMarket: "코스닥", stockIndex: 33.8, rate: -10 },
  { stockMarket: "나스닥", stockIndex: 192.8, rate: 10 },
  { stockMarket: "달러", stockIndex: 33.8, rate: -10 },
];

export default function MarketIndex() {
  const marketIndexItems = items.map((item) => (
    <>
      <MarketIndexItem
        stockMarket={item.stockMarket}
        stockIndex={item.stockIndex}
        rate={item.rate}
      />
    </>
  ));

  const leftSideMarketIndexItems = marketIndexItems.filter(
    (_, i) => (i + 1) % 2 === 1,
  );
  const rightSideMarketIndexItems = marketIndexItems.filter(
    (_, i) => (i + 1) % 2 === 0,
  );

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-20 py-[24px] mobile:overflow-scroll">
      <div className="flex justify-around mobile:hidden">
        <VerticalTicker items={leftSideMarketIndexItems} />
        <div className="absolute left-1/2 top-1/2 z-10 h-[32px] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gray-20" />
        <VerticalTicker items={rightSideMarketIndexItems} />
      </div>
      <div className="hidden px-[16px] mobile:flex">
        {marketIndexItems.map((marketIndexItem, i) => (
          <div className="relative flex shrink-0">
            {marketIndexItem}
            {i !== marketIndexItems.length - 1 && (
              <div className="mx-[16px] h-[32px] w-[1px] bg-gray-20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
