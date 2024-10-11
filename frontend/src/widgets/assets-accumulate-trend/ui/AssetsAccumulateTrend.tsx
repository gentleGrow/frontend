import AssetsAccumulateTrendTooltip from "@/widgets/assets-accumulate-trend/ui/AssetsAccumulateTrendTooltip";
import { LineChart, LineChartData, NoDataMessage } from "@/shared";

const emptyData: LineChartData = {
  dates: ["0", "1", "2", "3", "4", "5"],
  unit: "억원",
  values1: {
    values: [],
    name: "예정자산",
  },
  values2: {
    values: [],
    name: "실질가치",
  },
  xAxises: ["25", "26", "27", "28", "29", "30"],
};

const AssetsAccumulateTrend = () => {
  const random = Math.random() * 10 > 5;
  const data: null | LineChartData = random
    ? null
    : {
        dates: ["1년후", "2년후", "3년후", "4년후", "5년후", "6년후", "7년후"],
        unit: "억원",
        values1: {
          values: [10, 20, 30, 40, 50, 60, 70],
          name: "예정자산",
        },
        values2: {
          values: [5, 10, 15, 20, 25, 30, 35],
          name: "실질가치",
        },
        xAxises: ["25", "26", "27", "28", "29", "30"],
      };

  return (
    <div className="flex flex-col rounded-[8px] border border-gray-20 bg-white px-4 pb-5 pt-4">
      <header className="flex flex-row items-center gap-2">
        <h2 className="text-heading-2">자산 적립 추이</h2>
        <AssetsAccumulateTrendTooltip />
      </header>
      <div className={"relative pl-3"}>
        {!data && <NoDataMessage />}
        <LineChart data={data ?? emptyData} type={"auto"} />
      </div>
    </div>
  );
};

export default AssetsAccumulateTrend;
