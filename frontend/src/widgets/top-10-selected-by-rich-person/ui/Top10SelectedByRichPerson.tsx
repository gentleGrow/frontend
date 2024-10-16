import Image from "next/image";
import Top10SelectedByRichPersonItem from "./Top10SelectedByRichPersonItem";
import fetchRichPicks from "../api/fetchRichPicks";

export default async function Top10SelectedByRichPerson() {
  const top10Stocks = await fetchRichPicks();

  return (
    <div className="relative h-[592px] space-y-[16px] rounded-lg border border-gray-20 bg-white p-[16px] mobile:rounded-none mobile:border-none">
      <div className="flex items-center space-x-[8px]">
        <h2 className="text-heading-2">부자들이 선택한 종목 TOP10</h2>
        <Image src={"/images/tip.svg"} width={16} height={16} alt="tip" />
      </div>
      <div>
        <ul>
          {top10Stocks.length === 0 ? (
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
              종목 정보를 가져오지 못했어요.
            </p>
          ) : (
            top10Stocks.map((stock, index) => (
              <li key={index + 1}>
                <Top10SelectedByRichPersonItem stock={stock} rank={index + 1} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
