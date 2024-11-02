import React, { memo, ReactNode } from "react";

import TableCell from "./TableCell";
import TableHeader from "./TableHeader";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { UniversalDragEvent } from "@/shared/hooks/useDragAndDrop";
import { CellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export interface TableColumnProps {
  field: string;
  index: number;
  dataset: any;
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: string, data: any, rowId: number) => ReactNode;
  isLastColumn?: boolean;
  fieldWidth?: number;
  onDrag: (e: UniversalDragEvent) => void;
  onDragEnd: (e: UniversalDragEvent) => void;
  isClosestFromRight?: boolean;
  isClosestFromLeft?: boolean;
  onResize?: (field: string, size: number) => void;
  tableId?: string;
  isDraggable?: boolean;
  errorInfo?: CellErrorAtom | null;
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
  errorInfo,
}: TableColumnProps) => {
  const resizeHandler = (size: number) => {
    onResize?.(field, size);
  };

  return (
    <ResizablePanel
      defaultSize={fieldWidth}
      className="relative z-0 table-column border-collapse overflow-visible"
      minSize={6}
      onResize={resizeHandler}
      order={index}
      id={field}
    >
      {isClosestFromRight && (
        <div className="absolute -right-[2px] top-0 z-50 h-full w-[4px] bg-green-60" />
      )}
      {isClosestFromLeft && (
        <div className="absolute -left-[2px] top-0 z-50 h-full w-[4px] bg-green-60" />
      )}
      <TableHeader
        field={field}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        isDraggable={isDraggable}
      >
        {headerBuilder(field)}
        {!isLastColumn ? (
          <ResizableHandle className="-right-[5px] top-[5px] z-50 h-[32px] w-[10px] rounded-full bg-transparent after:hover:bg-green-60 active:after:bg-green-60" />
        ) : (
          <div className="absolute right-0 top-0 h-[42px] cursor-default bg-transparent"></div>
        )}
      </TableHeader>
      {dataset.map((data, idx) => (
        <TableCell
          error={errorInfo?.rowId === data?.id && field === errorInfo?.field}
          errorMessage={errorInfo?.message}
          key={data?.id ?? idx}
        >
          {cellBuilder(field, data[field], data.id)}
        </TableCell>
      ))}
    </ResizablePanel>
  );
};

export default memo(TableColumn);
