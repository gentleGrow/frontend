import { IncDecRate } from "@/shared";
import Image from "next/image";
import { RichPick } from "../api/fetchRichPicks";
import { commaizeNumber } from "@toss/utils";

export default function Top10SelectedByRichPersonItem({
  stock,
  rank,
}: {
  stock: RichPick;
  rank: number;
}) {
  return (
    <div className="flex h-[52px] items-center justify-between px-[4px]">
      <div className="flex w-fit shrink-0 items-center space-x-[8px] overflow-hidden pr-[8px]">
        <p
          className={`${rank < 4 && "text-green-60"} flex w-[2ch] shrink-0 items-center justify-center`}
        >
          {rank}
        </p>
        <div className="relative h-[28px] w-[28px] shrink-0">
          <Image src="/images/stock_test_logo.svg" fill alt={stock.name} />
        </div>
      </div>
      <div className="flex w-full justify-between space-x-[16px] overflow-hidden pr-[12px]">
        <p className="block w-full max-w-[128px] truncate text-body-2 except-mobile:max-w-[128px]">
          {stock.name}
        </p>
        <p className="block min-w-[102px] flex-1 items-center truncate text-right text-body-3">
          ₩{commaizeNumber(Number(stock.price.toFixed(0)))}
        </p>
      </div>
      <div className="flex shrink-0 items-center overflow-hidden">
        <IncDecRate rate={stock.rate} />
      </div>
    </div>
  );
}
