"use client";

import React, { memo, useId, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragAndDropDropdown } from "@/shared";
import { PopoverClose } from "@radix-ui/react-popover";

interface FieldState {
  isRequired: boolean;
  isChecked: boolean;
  name: string;
}

interface HandleColumDisplayButtonProps {
  fields: FieldState[];
  onReorder: (newFields: FieldState[]) => void;
  onReset?: () => void;
}

const HandleColumDisplayButton = ({
  fields: originFields,
  onReorder,
  onReset,
}: HandleColumDisplayButtonProps) => {
  const [fields, setFields] = useState(originFields);
  const [isChanged, setIsChanged] = useState(false);

  const handleClickCheckbox = (name: string) => {
    const newFields = fields.map((field) => {
      if (field.name === name) {
        return { ...field, isChecked: !field.isChecked };
      }
      return field;
    });
    setFields(newFields);
    setIsChanged(true);
  };

  const handleReorder = (newFields: FieldState[]) => {
    setFields(newFields);
    setIsChanged(true);
  };

  const handleComplete = () => {
    if (isChanged) {
      onReorder(fields);
      setIsChanged(false);
    }
  };

  const id = useId();
  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setIsChanged(false);
          setFields(originFields);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={"flex h-[44px] w-[44px] items-center justify-center"}
        >
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
      </PopoverTrigger>
      <PopoverContent className="rounded-8px flex h-[400px] w-[200px] flex-col gap-2 border border-gray-20 p-2.5">
        <header className="flex w-full flex-row items-center justify-between border-b border-b-gray-20 pb-[5px]">
          <label htmlFor={id} className="cursor-pointer">
            <button
              id={id}
              className="flex flex-row items-center gap-1"
              onClick={onReset}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5232 8C12.5232 6.80923 12.0982 5.65756 11.3247 4.7522C10.5513 3.84685 9.48008 3.24726 8.30392 3.06133C7.12776 2.8754 5.92385 3.11533 4.90883 3.73795C3.89381 4.36057 3.13431 5.325 2.76701 6.4577C2.3997 7.5904 2.44871 8.817 2.9052 9.9168C3.36169 11.0166 4.1957 11.9174 5.25715 12.457C6.31861 12.9967 7.53782 13.1398 8.6954 12.8607C9.85298 12.5815 10.8729 11.8984 11.5717 10.9342"
                  stroke="#5D646E"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <path
                  d="M9.8074 5.86124L12.7217 8.40595L14.1834 4.82376"
                  stroke="#5D646E"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-body-5 font-normal text-gray-100">
                초기화
              </span>
            </button>
          </label>
          <PopoverClose asChild>
            <button>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4964 6.51071C14.7745 6.2326 14.7745 5.78169 14.4964 5.50357C14.2183 5.22546 13.7674 5.22546 13.4893 5.50357L10 8.99286L6.51071 5.50357C6.2326 5.22546 5.78169 5.22546 5.50357 5.50357C5.22546 5.78169 5.22546 6.2326 5.50357 6.51071L8.99286 10L5.50357 13.4893C5.22546 13.7674 5.22546 14.2183 5.50357 14.4964C5.78169 14.7745 6.2326 14.7745 6.51071 14.4964L10 11.0071L13.4893 14.4964C13.7674 14.7745 14.2183 14.7745 14.4964 14.4964C14.7745 14.2183 14.7745 13.7674 14.4964 13.4893L11.0071 10L14.4964 6.51071Z"
                  fill="#5D646E"
                />
              </svg>
            </button>
          </PopoverClose>
        </header>
        <p className="flex flex-col gap-0.5 rounded-[4px] bg-gray-5 p-2 text-[11px] font-normal text-gray-70">
          <span>*최대 10개까지 추가할 수 있습니다.</span>
          <span>*종목명, 수량, 구매일자는 필수 항목입니다.</span>
        </p>
        <DragAndDropDropdown
          items={fields}
          onReorder={handleReorder}
          onCheckboxClicked={handleClickCheckbox}
        />
        <PopoverClose asChild>
          <button
            className="rounded-[6px] bg-green-60 py-[9.5px] text-body-3 font-semibold text-white hover:bg-green-70 disabled:bg-gray-10 disabled:text-gray-50 disabled:hover:bg-gray-10"
            onClick={handleComplete}
            disabled={!isChanged}
          >
            적용하기
          </button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default memo(HandleColumDisplayButton);
