import React, { memo, ReactNode } from "react";

import TableCell from "./TableCell";
import TableHeader from "./TableHeader";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { UniversalDragEvent } from "@/shared/hooks/useDragAndDrop";

export interface TableColumnProps {
  field: string;
  index: number;
  dataset: any;
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: string, data: any) => ReactNode;
  isLastColumn?: boolean;
  fieldWidth?: number;
  onDrag: (e: UniversalDragEvent) => void;
  onDragEnd: (e: UniversalDragEvent) => void;
  isClosestFromRight?: boolean;
  isClosestFromLeft?: boolean;
  onResize?: (field: string, size: number) => void;
  tableId?: string;
  isDraggable?: boolean;
}

const TableColumn = <T,>({
  field,
  index,
  dataset,
  headerBuilder,
  cellBuilder,
  isLastColumn,
  fieldWidth = 10,
  onDragEnd,
  onDrag,
  isClosestFromRight,
  isClosestFromLeft,
  onResize,
  isDraggable = true,
}: TableColumnProps) => {
  const resizeHandler = (size: number) => {
    onResize?.(field, size);
  };

  return (
    <ResizablePanel
      defaultSize={fieldWidth}
      className="relative table-column border-collapse"
      minSize={6}
      onResize={resizeHandler}
      order={index}
      id={field}
    >
      <TableHeader
        field={field}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        isDraggable={isDraggable}
      >
        {headerBuilder(field)}
        {!isLastColumn ? (
          <ResizableHandle className="right-0 top-0 h-[42px] w-2 bg-transparent" />
        ) : (
          <div className="absolute right-0 top-0 h-[42px] cursor-default bg-transparent"></div>
        )}
      </TableHeader>
      {dataset.map((data, idx) => (
        <TableCell key={idx}>{cellBuilder(field, data[field])}</TableCell>
      ))}
      {isClosestFromRight && (
        <div className="absolute -right-px top-0 z-50 h-full w-[4px] bg-green-60" />
      )}
      {isClosestFromLeft && (
        <div className="absolute -left-px top-0 z-50 h-full w-[4px] bg-green-60" />
      )}
    </ResizablePanel>
  );
};

export default memo(TableColumn);
