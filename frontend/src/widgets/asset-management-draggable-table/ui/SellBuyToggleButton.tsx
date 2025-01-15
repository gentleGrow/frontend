import { cn } from "@/lib/utils";

interface SellBuyBadgeProps {
  type: "매수" | "매도";
}

const SellBuyBadge = ({ type }: SellBuyBadgeProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-shrink-0 flex-row items-center justify-between gap-1 rounded-full bg-alert px-[5px] py-[3.5px]",
        type === "매수"
          ? "bg-badge-buy-background border-badge-buy-foreground border-2"
          : "bg-badge-sell-background border-badge-sell-foreground border-2",
      )}
    >
      <span
        className={cn(
          "break-keep text-body-3 font-semibold",
          type === "매수"
            ? "text-badge-buy-foreground"
            : "text-badge-sell-foreground",
        )}
      >
        {type}
      </span>
      <span className="flex h-full flex-col justify-center gap-0.5">
        <span
          className={cn(
            "h-[3px] w-[3px] rounded-full",
            type === "매수"
              ? "bg-badge-buy-foreground"
              : "bg-badge-sell-midground",
          )}
        />
        <span
          className={cn(
            "h-[3px] w-[3px] rounded-full",
            type === "매수"
              ? "bg-badge-buy-midground"
              : "bg-badge-sell-foreground",
          )}
        />
      </span>
    </div>
  );
};

interface SellBuyToggleButtonProps {
  type: "매수" | "매도";
  onClick: (type: "매수" | "매도") => void;
}

const SellBuyToggleButton = ({ type, onClick }: SellBuyToggleButtonProps) => {
  const handleClick = () => {
    onClick(type === "매수" ? "매도" : "매수");
  };
  return (
    <button type="button" onClick={handleClick}>
      <SellBuyBadge type={type} />
    </button>
  );
};

export default SellBuyToggleButton;
