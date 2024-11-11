"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropdownMenus from "./DropdownMenus";

export default function Profile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="cursor-pointer overflow-hidden rounded-md text-white hover:text-[#EFF0F1]"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="16"
              cy="16"
              r="10.25"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
            <circle
              cx="15.9997"
              cy="11.3385"
              r="2.22917"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
            <path
              d="M12.4651 16.6387C12.4763 16.6142 12.4957 16.5942 12.52 16.5824C14.7157 15.5082 17.2843 15.5082 19.4799 16.5824C19.5042 16.5942 19.5236 16.6142 19.5349 16.6387L21.4841 20.9028C21.5598 21.0683 21.4388 21.2567 21.2568 21.2567H10.7432C10.5611 21.2567 10.4401 21.0683 10.5158 20.9028L12.4651 16.6387Z"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-3">
        <DropdownMenus />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
