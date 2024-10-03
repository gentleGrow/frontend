import SeeMoreButton from "./SeeMoreButton";
import StockTable from "./StockTable";
import fetchMyStocks from "../api/fetchMyStocks";
import fetchDummyMyStocks from "../api/fetchDummyMyStocks";
import { cookies } from "next/headers";

export default async function MyStocks() {
  const hasAccessToken = cookies().get("accessToken") ? true : false;
  const data = hasAccessToken
    ? await fetchMyStocks()
    : await fetchDummyMyStocks();

  const stocks = data.slice(0, 6);
  return (
    <div className="h-[390px] rounded-xl border border-gray-20 bg-white mobile:rounded-none mobile:border-none">
      <div className="flex items-center justify-between px-[16px] pb-[12px] pt-[16px]">
        <h3 className="text-heading-2">내 보유주식</h3>
        <SeeMoreButton href={"/asset-management/sheet"} />
      </div>
      <div className="border-t border-gray-20">
        {stocks.length === 0 ? (
          <div className="flex h-[288px] items-center justify-center">
            <p className="text-center text-body-2">
              표시할 데이터가 없어요.
              <br />
              <span className="text-green-60">시트</span>에서 투자 정보를 먼저
              입력해 주세요.
            </p>
          </div>
        ) : (
          <StockTable stocks={stocks} />
        )}
      </div>
    </div>
  );
}
