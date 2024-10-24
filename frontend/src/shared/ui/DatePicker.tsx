"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/shared";
import * as React from "react";

const CalendarIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="6.25" width="14" height="13" rx="1.5" stroke="#35393F" />
      <path d="M4.5 9.72119L19.5 9.72119" stroke="#35393F" />
      <path
        d="M8.75 4.25C8.75 3.97386 8.52614 3.75 8.25 3.75C7.97386 3.75 7.75 3.97386 7.75 4.25L8.75 4.25ZM7.75 4.25L7.75 6.70703L8.75 6.70703L8.75 4.25L7.75 4.25Z"
        fill="#35393F"
      />
      <path
        d="M16.75 4.25C16.75 3.97386 16.5261 3.75 16.25 3.75C15.9739 3.75 15.75 3.97386 15.75 4.25L16.75 4.25ZM15.75 4.25L15.75 6.70703L16.75 6.70703L16.75 4.25L15.75 4.25Z"
        fill="#35393F"
      />
      <rect
        x="7.625"
        y="11.7598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
      <rect
        x="7.625"
        y="15.2598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
      <rect
        x="11.125"
        y="11.7598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
      <rect
        x="11.125"
        y="15.2598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
      <rect
        x="14.625"
        y="11.7598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
      <rect
        x="14.625"
        y="15.2598"
        width="1.5"
        height="1.5"
        rx="0.35"
        fill="#35393F"
      />
    </svg>
  );
};

interface DatePickerProps {
  date: Date | null;
  onChange: (date: Date) => void;
}

const DatePicker = ({ date, onChange }: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateChange = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger onClick={() => setIsOpen(true)} asChild>
        <button
          className={cn(
            "flex w-full max-w-[242px] flex-row items-center gap-4 text-body-3 font-normal",
            date === undefined ? "text-gray-50" : "text-gray-90",
          )}
        >
          <CalendarIcon />
          {date ? (
            <span>{format(date, "yyyy.MM.dd")}</span>
          ) : (
            <span>YYYY.MM.DD</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Calendar selectedDate={date} onSelectDate={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
