import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SortingUpHoverIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] hover:bg-gray-10"
  >
    <path
      d="M9.25 15C9.25 15.4142 9.58579 15.75 10 15.75C10.4142 15.75 10.75 15.4142 10.75 15L9.25 15ZM10.75 15L10.75 5L9.25 5L9.25 15L10.75 15Z"
      fill="#7A8088"
    />
    <path
      d="M13 8L10 5L7 8"
      stroke="#7A8088"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortingUpSelectedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] hover:bg-gray-10"
  >
    <path
      d="M9.25 15C9.25 15.4142 9.58579 15.75 10 15.75C10.4142 15.75 10.75 15.4142 10.75 15L9.25 15ZM10.75 15L10.75 5L9.25 5L9.25 15L10.75 15Z"
      fill="#05D665"
    />
    <path
      d="M13 8L10 5L7 8"
      stroke="#05D665"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortingDownHoverIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] hover:bg-gray-10"
  >
    <path
      d="M10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.58579 4.25 9.25 4.58579 9.25 5L10.75 5ZM9.25 5L9.25 15L10.75 15L10.75 5L9.25 5Z"
      fill="#7A8088"
    />
    <path
      d="M7 12L10 15L13 12"
      stroke="#7A8088"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortingDownSelectedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] hover:bg-gray-10"
  >
    <path
      d="M10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.58579 4.25 9.25 4.58579 9.25 5L10.75 5ZM9.25 5L9.25 15L10.75 15L10.75 5L9.25 5Z"
      fill="#05D665"
    />
    <path
      d="M7 12L10 15L13 12"
      stroke="#05D665"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface SortingButtonProps {
  sorting: "asc" | "desc";
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SortingButton = ({ sorting, isActive, onClick }: SortingButtonProps) => {
  let content: ReactNode;

  if (sorting === "asc") {
    content = isActive ? <SortingUpSelectedIcon /> : <SortingUpHoverIcon />;
  } else {
    content = isActive ? <SortingDownSelectedIcon /> : <SortingDownHoverIcon />;
  }

  return (
    <button
      className={cn("z-50 group-hover:block", isActive ? "block" : "hidden")}
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default SortingButton;
