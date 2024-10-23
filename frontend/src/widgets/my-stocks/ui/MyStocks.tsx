import SeeMoreButton from "./SeeMoreButton";
import StockTable from "./StockTable";
import fetchMyStocks from "../api/fetchMyStocks";
import fetchDummyMyStocks from "../api/fetchDummyMyStocks";
import { cookies } from "next/headers";
import { NoDataMessage } from "@/shared";

export default async function MyStocks() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;
  const data = hasAccessToken
    ? await fetchMyStocks()
    : await fetchDummyMyStocks();

  const stocks = data.slice(0, 6);
  return (
    <div className="relative h-[390px] rounded-xl border border-gray-20 bg-white mobile:rounded-none mobile:border-none">
      <div className="flex items-center justify-between px-[16px] pb-[12px] pt-[16px]">
        <h3 className="text-heading-2 text-gray-80">내 보유주식</h3>
        {stocks[0]?.name !== "" && stocks.length !== 0 && (
          <SeeMoreButton href={"/asset-management/sheet"} />
        )}
      </div>
      <div className="border-t border-gray-20">
        {stocks[0]?.name === "" || stocks.length === 0 ? (
          <NoDataMessage />
        ) : (
          <StockTable stocks={stocks} />
        )}
      </div>
    </div>
  );
}
