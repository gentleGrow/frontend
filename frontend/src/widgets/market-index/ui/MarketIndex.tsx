import fetchIndices from "../api/fetchIndices";
import MarketIndexItem from "./MarketIndexItem";
import SwiperBox from "./SwiperBox";
import VerticalTicker from "./VerticalTicker";

export default async function MarketIndex() {
  const indices = await fetchIndices();
  const marketIndexItems = indices.map((index, i) => (
    <>
      <MarketIndexItem
        stockMarket={index.name_kr}
        stockIndex={index.current_value}
        rate={index.change_percent}
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
    <div className="relative flex h-[80px] w-full overflow-hidden rounded-md border border-gray-20 bg-gray-0 py-[24px] mobile:rounded-none mobile:border-none">
      <div className="flex w-full mobile:hidden">
        <div className="flex w-1/2 justify-center">
          {indices ? (
            <VerticalTicker items={leftSideMarketIndexItems} />
          ) : (
            "주식 지수 정보를 가져오지 못했습니다."
          )}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 h-[32px] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gray-20" />
        <div className="flex w-1/2 justify-center">
          {indices ? <VerticalTicker items={rightSideMarketIndexItems} /> : ""}
        </div>
      </div>
      <div className="hidden mobile:flex">
        {indices ? (
          <SwiperBox items={marketIndexItems} />
        ) : (
          "주식 지수 정보를 가져오지 못했습니다."
        )}
      </div>
    </div>
  );
}
