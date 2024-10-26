import AssetsAccumulateTrendTooltip from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrendTooltip";
import { LineChart, NoDataMessage } from "@/shared";
import { getAssetSaveTrent } from "@/widgets/assets-accumulate-trend/api/getAssetSaveTrent";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const AssetsAccumulateTrend = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const data = await getAssetSaveTrent(accessToken ?? null);

  return (
    <div className="flex flex-col rounded-[8px] border border-gray-20 bg-white px-4 pb-5 pt-4">
      <header className="flex flex-row items-center gap-2">
        <h2 className="text-heading-2">자산 적립 추이</h2>
        <AssetsAccumulateTrendTooltip />
      </header>
      <div className={"relative pl-3"}>
        {!data && <NoDataMessage />}
        <LineChart data={data ?? null} type={"auto"} />
      </div>
    </div>
  );
};

export default AssetsAccumulateTrend;
