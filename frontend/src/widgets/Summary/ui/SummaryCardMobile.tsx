import { IncDecRate } from "@/shared";

export default function SummaryCardMobile({
  totalAmount,
  increaseAmount,
  investmentAmount,
  profit_amount,
  profit_rate,
}: {
  totalAmount: number;
  increaseAmount: number;
  investmentAmount: number;
  profit_amount: number;
  profit_rate: number;
}) {
  return (
    <div className="bg-white p-[16px]">
      <div className="flex flex-col">
        <p className="text-[20px] font-bold leading-[24px]">나의 총 자산</p>
        <p className="mb-[8px] mt-[4px] text-[28px] font-bold leading-[33.61px]">
          ₩{Number(totalAmount.toFixed(0)).toLocaleString("ko-kr")}
        </p>
        <div className="flex items-center space-x-[7px]">
          <p className="text-sm font-medium">지난 달 보다 </p>
          <span
            className={`font-bold ${increaseAmount === 0 && "text-gray-100"} ${increaseAmount > 0 && "text-alert"} ${increaseAmount < 0 && "text-decrease"}`}
          >
            {increaseAmount > 0 && "+"}₩{increaseAmount.toFixed(0)}
          </span>
        </div>
        <div className="mt-[27px] flex flex-col space-y-[8px]">
          <div className="flex justify-between">
            <p className="text-[14px] font-medium text-gray-80">
              나의 투자 금액
            </p>
            <p className="text-[16px] font-bold">
              ₩{Number(investmentAmount.toFixed(0)).toLocaleString("ko-kr")}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[14px] font-medium text-gray-80">수익금</p>
            <div className="flex items-center space-x-[8px]">
              <IncDecRate rate={profit_rate} />
              <p className="text-[16px] font-bold">
                ₩{Number(profit_amount.toFixed(0)).toLocaleString("ko-kr")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
