import Tooltip from "@/shared/ui/Tooltip";
import Image from "next/image";

const AssetsAccumulateTrendTooltip = () => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Image src={"/images/tip.svg"} width={16} height={16} alt="tip" />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <li className="flex flex-row items-start">
          <span className="mr-1">*</span>
          <p className="break-normal">
            최근 3개월 평균 투자 금액, 평균 수익률, 평균 배당금을 기준으로
            계산합니다.
          </p>
        </li>
        <li className="flex flex-row items-start">
          <span className="mr-1">*</span>
          <p className="whitespace-normal">물가 상승률은 3%로 계산합니다.</p>
        </li>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default AssetsAccumulateTrendTooltip;
