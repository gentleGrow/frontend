import React, { memo } from "react";

const HandleColumDisplayButton = () => {
  return (
    <button className={"flex h-[44px] w-[44px] items-center justify-center"}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="7" width="16" height="1.5" fill="#7A8088" />
        <rect
          x="9"
          width="16"
          height="1.5"
          transform="rotate(90 9 0)"
          fill="#7A8088"
        />
      </svg>
    </button>
  );
};

export default memo(HandleColumDisplayButton);
