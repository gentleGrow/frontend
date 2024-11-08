import React, { memo, ReactNode } from "react";

import TableCell from "./TableCell";
import TableHeader from "./TableHeader";

import { ResizablePanel } from "@/components/ui/resizable";
import { UniversalDragEvent } from "@/shared/hooks/useDragAndDrop";
import { CellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export interface TableColumnProps {
  field: string;
  index: number;
  dataset: any;
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: string, data: any, rowId: number) => ReactNode;
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
      className="relative z-0 -ml-[3px] table-column border-collapse"
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
      </TableHeader>
      {dataset.map((data, idx) => (
        <>
          <TableCell
            error={errorInfo?.rowId === data?.id && field === errorInfo?.field}
            errorMessage={errorInfo?.message}
            key={data?.id ?? idx}
          >
            {cellBuilder(field, data[field], data.id)}
          </TableCell>
          <div className="h-[1px] w-full bg-gray-10" />
        </>
      ))}
    </ResizablePanel>
  );
};

export default memo(TableColumn);
