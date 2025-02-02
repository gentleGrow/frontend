import React from "react";
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
    <div className="flex h-[95px] w-full flex-row items-center overflow-hidden rounded-md border border-gray-20 bg-gray-0 mobile:rounded-none mobile:border-none">
      {indexes.length !== 0 ? (
        <SwiperBox items={marketIndexItems} />
      ) : (
        <p className="flex w-full items-center justify-center text-sm">
          주식 지수 정보를 가져오지 못했어요.
        </p>
      )}
    </div>
  );
}
