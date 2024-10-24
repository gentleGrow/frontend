import { IncDecRate } from "@/shared";

interface AssetManagementSummaryCardProps {
  title: string;
  value: number;
  ratio?: number;
}

const AssetManagementSummaryCard = ({
  title,
  value,
  ratio,
}: AssetManagementSummaryCardProps) => {
  return (
    <div className="flex min-w-[246px] flex-1 flex-col gap-5 rounded-[8px] bg-white p-4">
      <h3 className="text-heading-4 text-gray-80">{title}</h3>
      <div className="flex w-full flex-row items-center gap-4">
        <div className="line-clamp-1 whitespace-pre-wrap break-all text-[24px] font-bold text-gray-100">
          ₩{value.toLocaleString("ko-KR")}
        </div>
        {ratio !== undefined && <IncDecRate rate={ratio} />}
      </div>
    </div>
  );
};

export default AssetManagementSummaryCard;
