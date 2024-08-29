"use client";

import MarketIndexItem from "./MarketIndexItem";
import SwiperBox from "./SwiperBox";
import VerticalTicker from "./VerticalTicker";
const items = [
  { stockMarket: "코스피", stockIndex: 192.8, rate: 10 },
  { stockMarket: "코스닥", stockIndex: 33.8, rate: -10 },
  { stockMarket: "나스닥", stockIndex: 192.8, rate: 10 },
  { stockMarket: "달러", stockIndex: 33.8, rate: -10 },
];

export default function MarketIndex() {
  const marketIndexItems = items.map((item, i) => (
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
    <div className="relative overflow-hidden rounded-lg border border-gray-20 py-[24px]">
      <div className="flex mobile:hidden">
        <div className="flex basis-1/2 justify-center">
          <VerticalTicker items={leftSideMarketIndexItems} />
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 h-[32px] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gray-20" />
        <div className="flex basis-1/2 justify-center">
          <VerticalTicker items={rightSideMarketIndexItems} />
        </div>
      </div>
      <div className="hidden px-[16px] mobile:flex">
        {<SwiperBox items={marketIndexItems} />}
      </div>
    </div>
  );
}
