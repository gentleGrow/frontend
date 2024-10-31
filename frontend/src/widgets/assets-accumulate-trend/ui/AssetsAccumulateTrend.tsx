import AssetsAccumulateTrendTooltip from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrendTooltip";
import { LineChart, NoDataMessage } from "@/shared";
import { getAssetSaveTrent } from "@/widgets/assets-accumulate-trend/api/getAssetSaveTrent";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const AssetsAccumulateTrend = async () => {
  const accessToken = cookies()?.get(ACCESS_TOKEN)?.value;
  const data = await getAssetSaveTrent(accessToken ?? null);

  return (
    <div className="flex min-h-[320px] flex-col rounded-[8px] border border-gray-20 bg-white px-4 pb-5 pt-4 mobile:rounded-none mobile:border-none">
      <header className="flex flex-row items-center gap-2">
        <h2 className="text-heading-2">자산 적립 추이</h2>
        <AssetsAccumulateTrendTooltip />
      </header>
      <div className={"relative h-full pl-3"}>
        {data.xAxises.length === 0 && <NoDataMessage />}
        {data.xAxises.length > 0 && (
          <LineChart data={data ?? null} type={"auto"} />
        )}
      </div>
    </div>
  );
};

export default AssetsAccumulateTrend;
