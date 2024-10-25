import React from "react";

const CalendarRightArrowButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
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
          d="M8.05025 14.9497L13 10L8.05025 5.05025"
          stroke="#7A8088"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default CalendarRightArrowButton;
