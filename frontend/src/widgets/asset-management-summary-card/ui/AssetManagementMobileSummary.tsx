import { IncDecRate } from "@/shared";

interface AssetManagementSummaryCardProps {
  totalAmount: number;
  investedAmount: number;
  profitAmount: number;
  dividendAmount: number;
  profitRate: number;
}

const AssetManagementMobileSummary = ({
  totalAmount,
  investedAmount,
  dividendAmount,
  profitAmount,
  profitRate,
}: AssetManagementSummaryCardProps) => {
  return (
    <div className="flex w-full flex-col gap-7 bg-white p-5 except-mobile:hidden">
      <header className="flex flex-col gap-1">
        <h3 className="text-heading-2 text-gray-80">나의 총 자산</h3>
        <h3 className="text-[28px] font-bold leading-[33px] text-gray-100">
          ₩{totalAmount.toLocaleString("ko-KR")}
        </h3>
      </header>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <span className="text-[14px] font-medium text-gray-80">
            투자 금액
          </span>
          <span className="text-heading-4 text-gray-100">
            ₩{investedAmount.toLocaleString("ko-KR")}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-[14px] font-medium text-gray-80">수익금</span>
          <span className="flex flex-row items-center gap-2">
            <IncDecRate rate={profitRate} />
            <span className="text-heading-4 text-gray-100">
              ₩{profitAmount.toLocaleString("ko-KR")}
            </span>
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-[14px] font-medium text-gray-80">배당금</span>
          <span className="text-heading-4 text-gray-100">
            ₩{dividendAmount.toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetManagementMobileSummary;
