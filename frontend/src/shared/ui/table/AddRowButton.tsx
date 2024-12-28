import React, { memo } from "react";

const AddRowButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-[44px] w-full flex-row items-center gap-2 px-3 py-[9px]"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="group-hover:fill-gray-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="white" />
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx="3.5"
          stroke="#D8DADC"
        />
        <g clipPath="url(#clip0_661_2765)">
          <rect x="7" y="11.25" width="10" height="1.5" fill="#7A8088" />
          <rect
            x="12.75"
            y="7"
            width="10"
            height="1.5"
            transform="rotate(90 12.75 7)"
            fill="#7A8088"
          />
        </g>
        <defs>
          <clipPath id="clip0_661_2765">
            <rect
              width="10"
              height="10"
              fill="white"
              transform="translate(7 7)"
            />
          </clipPath>
        </defs>
      </svg>
      <span className="text-sm font-medium text-gray-100">종목 추가</span>
    </button>
  );
};

export default memo(AddRowButton);
