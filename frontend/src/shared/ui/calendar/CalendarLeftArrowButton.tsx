import React from "react";

const CalendarLeftArrowButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} type={"button"}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-[4px] hover:bg-gray-10"
      >
        <path
          d="M11.9497 5.05025L7 10L11.9497 14.9497"
          stroke="#7A8088"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default CalendarLeftArrowButton;
