"use client";

import { Reorder, useDragControls } from "framer-motion";
import { useState } from "react";
import { CheckBox } from "@/shared";

interface ItemState {
  isChecked: boolean;
  isRequired: boolean;
  name: string;
}

interface DragAndDropDropdownProps {
  items: ItemState[];
  onReorder: (items: ItemState[]) => void;
  onCheckboxClicked: (name: string) => void;
}

// TODO: 현재는 여기서 도메인 로직을 처리하는데, 이는 복잡도를 해결하기에 시간이 오래 걸릴거 같아 이렇게 처리함 추후 해결해야함.
const parseField = (field: string) => {
  if (field === "거래가") {
    return "매수가/매도가";
  }

  if (field === "거래금") {
    return "매수금/매도금";
  }

  return field;
};

const DragAndDropDropdown = ({
  items,
  onCheckboxClicked,
  onReorder,
}: DragAndDropDropdownProps) => {
  const requiredItems = items.filter((item) => item.isRequired);
  const draggableItems = items.filter((item) => !item.isRequired);

  return (
    <div className="flex h-full max-h-[230px] flex-col gap-[4.5px] overflow-y-auto scrollbar-hide">
      <ul className="flex flex-col gap-[4.5px]">
        {requiredItems.map((item) => (
          <DragAndDropNotDraggableItem key={item.name} item={item} />
        ))}
      </ul>
      <Reorder.Group
        layoutScroll
        className="flex flex-col gap-[4.5px]"
        axis="y"
        as="ul"
        values={items}
        onReorder={(newOrdered) => {
          onReorder([...requiredItems, ...newOrdered]);
        }}
      >
        {draggableItems.map((item) => (
          <DragAndDropDropdownDraggableItem
            item={item}
            isChecked={item.isChecked}
            onCheckboxClicked={() => onCheckboxClicked(item.name)}
            key={item.name}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};

interface DragAndDropDropdownItemProps {
  isChecked: boolean;
  item: ItemState;
  onCheckboxClicked: () => void;
}

const DragAndDropDropdownDraggableItem = ({
  item,
  isChecked,
  onCheckboxClicked,
}: DragAndDropDropdownItemProps) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      className="group relative flex flex-row items-center justify-between pl-2.5 pr-1"
      value={item}
      as="li"
      dragListener={false}
      dragControls={controls}
      drag="y"
      dragPropagation={false}
    >
      {isDragging && (
        <div className="absolute left-0 top-0 h-full w-[2px] bg-green-60" />
      )}
      <div className="flex flex-row items-center gap-[4.5px]">
        <CheckBox checked={isChecked} onChange={onCheckboxClicked} />
        <span className="text-body-2 text-gray-90 except-mobile:group-hover:font-semibold">
          {parseField(item.name)}
        </span>
      </div>
      <button
        className="cursor-grab touch-none"
        type="button"
        onPointerUp={(e) => {
          e.currentTarget.style.cursor = "grab";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            setIsDragging(false);
            parent.style.backgroundColor = "transparent";
          }
          e.currentTarget.style.border = "none";
        }}
        onPointerDown={(e) => {
          e.currentTarget.style.cursor = "grabbing";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            setIsDragging(true);
            parent.style.backgroundColor = "rgba(247, 248, 250, 1)";
          }
          controls.start(e);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9.5" cy="4.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="4.5" r="1" fill="#7A8088" />
          <circle cx="9.5" cy="11.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="11.5" r="1" fill="#7A8088" />
          <circle cx="9.5" cy="18.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="18.5" r="1" fill="#7A8088" />
        </svg>
      </button>
    </Reorder.Item>
  );
};

const DragAndDropNotDraggableItem = ({
  item,
  disabled = true,
  isChecked = true,
  onCheckboxClicked,
}: Pick<DragAndDropDropdownItemProps, "item"> & {
  disabled?: boolean;
  isChecked?: boolean;
  onCheckboxClicked?: () => void;
}) => {
  return (
    <div className="group relative flex flex-row items-center justify-between overflow-y-auto pl-2.5 pr-1">
      <div className="flex flex-row items-center gap-[4.5px] opacity-40">
        <CheckBox
          checked={isChecked}
          readOnly={disabled}
          onChange={onCheckboxClicked}
        />
        <span className="text-body-2 text-gray-90 group-hover:font-semibold">
          {item.name}
        </span>
      </div>
      <button type="button" disabled>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9.5" cy="4.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="4.5" r="1" fill="#7A8088" />
          <circle cx="9.5" cy="11.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="11.5" r="1" fill="#7A8088" />
          <circle cx="9.5" cy="18.5" r="1" fill="#7A8088" />
          <circle cx="14.5" cy="18.5" r="1" fill="#7A8088" />
        </svg>
      </button>
    </div>
  );
};

export default DragAndDropDropdown;
