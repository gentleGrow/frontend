import React, { memo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragAndDropDropdown } from "@/shared";

interface FieldState {
  isRequired: boolean;
  isChecked: boolean;
  name: string;
}

interface HandleColumDisplayButtonProps {
  fields: FieldState[];
  onReorder: (newFields: FieldState[]) => void;
  onClickFieldCheckbox: (name: string) => void;
}

const HandleColumDisplayButton = ({
  fields,
  onReorder,
  onClickFieldCheckbox,
}: HandleColumDisplayButtonProps) => {
  return (
    <Popover>
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
      <PopoverContent>
        <DragAndDropDropdown
          items={fields}
          onReorder={onReorder}
          onCheckboxClicked={onClickFieldCheckbox}
        />
      </PopoverContent>
    </Popover>
  );
};

export default memo(HandleColumDisplayButton);
