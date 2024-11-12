import React, { Fragment, memo, ReactNode } from "react";

import TableCell from "./TableCell";
import TableHeader from "./TableHeader";
import { UniversalDragEvent } from "@/shared/hooks/useDragAndDrop";
import { CellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

export interface TableColumnProps {
  field: string;
  dataset: any;
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: string, data: any, rowId: number) => ReactNode;
  onDragEnd: (e: UniversalDragEvent) => void;
  onDrag: (e: UniversalDragEvent) => void;
  isDraggable?: boolean;
  errorInfo?: CellErrorAtom | null;
}

const TableColumn = <T,>({
  field,
  dataset,
  headerBuilder,
  cellBuilder,
  onDragEnd,
  onDrag,
  isDraggable = true,
  errorInfo,
}: TableColumnProps) => {
  return (
    <div className="z-0 table-column flex-1 border-collapse">
      <TableHeader
        field={field}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        isDraggable={isDraggable}
      >
        {headerBuilder(field)}
      </TableHeader>
      {dataset.map((data, idx) => (
        <Fragment key={data?.id ?? idx}>
          <TableCell
            error={errorInfo?.rowId === data?.id && field === errorInfo?.field}
            errorMessage={errorInfo?.message}
          >
            {cellBuilder(field, data[field], data.id)}
          </TableCell>
          <div className="h-[1px] w-full bg-gray-10" />
        </Fragment>
      ))}
    </div>
  );
};

export default memo(TableColumn);
