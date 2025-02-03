"use client";

import React, { FC, MouseEvent } from "react";
import Tooltip from "@/shared/ui/Tooltip";
import { createPortal } from "react-dom";

interface SellBuyButtonProps {
  onClick: (event: MouseEvent) => void;
  openTooltip: boolean;
  name: string;
}

const SellBuyButton: FC<SellBuyButtonProps> = ({
  name,
  onClick,
  openTooltip,
}) => {
  return (
    <Tooltip open={openTooltip}>
      <Tooltip.Trigger>
        <button
          type="button"
          className="rounded-[4px] border border-gray-20 px-1.5 py-[5px] text-sm font-semibold text-gray-60 hover:bg-gray-10"
          onClick={onClick}
        >
          + 매매
        </button>
      </Tooltip.Trigger>
      {typeof window !== "undefined" &&
        document.body &&
        createPortal(
          <Tooltip.Content>
            {name} 추가 매매 건은 이 버튼으로 추가해주세요.
          </Tooltip.Content>,
          document.body,
        )}
    </Tooltip>
  );
};

export default SellBuyButton;
