import { IncDecRate } from "@/shared";
import Image from "next/image";
import { RichPick } from "../api/fetchRichPicks";

export default function Top10SelectedByRichPersonItem({
  stock,
  rank,
}: {
  stock: RichPick;
  rank: number;
}) {
  return (
    <div className="flex h-[52px] items-center justify-between px-[4px]">
      <div className="flex items-center space-x-[8px] overflow-hidden">
        <p
          className={`${rank < 4 && "text-green-60"} flex w-[2ch] shrink-0 items-center justify-center`}
        >
          {rank}
        </p>
        <Image
          src="/images/stock_test_logo.svg"
          width={28}
          height={28}
          alt={stock.name}
        />
        <p className="block max-w-[94ch] truncate text-body-2 except-mobile:max-w-[108ch]">
          {stock.name}
        </p>
      </div>

      <div className="flex items-center space-x-[12px] overflow-hidden">
        <p className="block items-center truncate text-body-3">
          ₩{stock.price.toLocaleString("ko-KR")}
        </p>
        <IncDecRate rate={stock.rate} />
      </div>
    </div>
  );
}
