"use client";

import { ButtonHTMLAttributes, FC } from "react";

const SellBuyButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (attrs) => {
  return (
    <button
      {...attrs}
      className="rounded-[4px] border border-gray-20 px-1.5 py-[5px] text-sm font-semibold text-gray-60"
    >
      + 매매
    </button>
  );
};

export default SellBuyButton;
