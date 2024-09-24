import fetchIndexes from "../api/fetchIndexes";
import MarketIndexItem from "./MarketIndexItem";
import SwiperBox from "./SwiperBox";

export default async function MarketIndexes() {
  const indexes = await fetchIndexes();
  const marketIndexItems = indexes.map((index) => (
    <>
      <MarketIndexItem
        stockMarket={index.name_kr}
        stockIndex={index.current_value}
        rate={index.change_percent}
      />
    </>
  ));

  return (
    <div className="relative h-[95px] w-full items-center overflow-hidden rounded-md border border-gray-20 bg-gray-0 mobile:rounded-none mobile:border-none">
      <div className="flex h-full items-center px-[16px]">
        {indexes ? (
          <SwiperBox items={marketIndexItems} />
        ) : (
          "주식 지수 정보를 가져오지 못했습니다."
        )}
      </div>
    </div>
  );
}
