import { SegmentedButtonProps } from "../types/component-props";

export default function SegmentedButton({
  numberOfButtons,
  isSelected = false,
  isHover = false,
  onClick,
  children,
}: SegmentedButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-1/${numberOfButtons} grow rounded-md px-[16px] py-[3.5px] text-center mobile:px-[8px] ${isSelected ? "bg-white text-body-3 text-gray-100" : "text-body-2 text-gray-60"} hover:text-gray-90 ${isHover && "text-gray-90"}`}
    >
      {children}
    </button>
  );
}
