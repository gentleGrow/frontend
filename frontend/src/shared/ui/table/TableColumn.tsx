import React, { memo, ReactNode } from "react";

import TableCell from "./TableCell";
import TableHeader from "./TableHeader";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

export interface TableColumnProps {
  field: string;
  dataset: any;
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: string, data: any) => ReactNode;
  isLastColumn?: boolean;
  fieldWidth?: number;
}

const TableColumn = <T,>({
  field,
  dataset,
  headerBuilder,
  cellBuilder,
  isLastColumn,
  fieldWidth = 10,
}: TableColumnProps) => {
  return (
    <ResizablePanel
      defaultSize={fieldWidth}
      className="border-collapse"
      minSize={6}
    >
      <TableHeader>
        {headerBuilder(field)}
        {!isLastColumn ? (
          <ResizableHandle className="right-0 top-0 h-[42px] w-2 bg-gray-30" />
        ) : (
          <div className="absolute right-0 top-0 h-[42px] w-px cursor-default bg-gray-30"></div>
        )}
      </TableHeader>
      {dataset.map((data, idx) => (
        <TableCell key={idx}>{cellBuilder(field, data[field])}</TableCell>
      ))}
    </ResizablePanel>
  );
};

export default memo(TableColumn);
