import Tooltip from "@/shared/ui/Tooltip";
import Image from "next/image";

const TooltipWithIcon = ({ text }: { text: string }) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className="flex h-5 w-5 items-center justify-center rounded-[4px] hover:bg-gray-10">
          <Image src={"/images/tip.svg"} width={12} height={12} alt="tip" />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>{text}</Tooltip.Content>
    </Tooltip>
  );
};

export default TooltipWithIcon;
