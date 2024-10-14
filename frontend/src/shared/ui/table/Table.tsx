"use client";

import React, { ReactNode } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import TableColumn from "@/shared/ui/table/TableColumn";
import DeleteRowIconButton from "@/shared/ui/table/DeleteRowIconButton";
import { usePreservedCallback } from "@/shared/hooks/usePreservedCallback";
import { usePreservedReference } from "@/shared/hooks/usePreservedRef";
import HandleColumDisplayButton from "@/shared/ui/table/HandleColumDisplayButton";
import AddRowButton from "@/shared/ui/table/AddRowButton";

export interface TableProps<T extends unknown> {
  fields: string[];
  dataset: T[];
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: any, data: any) => ReactNode;
  onAddRow: () => void;
  onFieldChane: () => void;
  onDeleteRow: (id: number | string) => void;
  fixWidth?: boolean;
  fieldWidth?: (key: string) => number;
}

const Table = <T extends unknown>({
  fields,
  dataset,
  cellBuilder,
  headerBuilder,
  onAddRow,
  onDeleteRow,
  onFieldChane,
  fieldWidth,
  fixWidth = false,
}: TableProps<T>) => {
  const preservedCellBuilder = usePreservedCallback(cellBuilder);
  const preservedHeaderBuilder = usePreservedCallback(headerBuilder);
  const preservedOnAddRow = usePreservedCallback(onAddRow);
  const preservedOnDeleteRow = usePreservedCallback(onDeleteRow);
  const preservedOnFieldChange = usePreservedCallback(onFieldChane);

  const preservedFields = usePreservedReference(fields);
  const preservedDataset = usePreservedReference(dataset);

  return (
    <div
      className="rounded-[4px] border border-gray-20 bg-white"
      style={{
        width: fixWidth ? "1360px" : "100%",
      }}
    >
      <ResizablePanelGroup direction="horizontal" className="relative">
        {preservedFields.map((field, index) => (
          <TableColumn
            key={field}
            field={field}
            dataset={preservedDataset}
            headerBuilder={preservedHeaderBuilder}
            cellBuilder={preservedCellBuilder}
            fieldWidth={fieldWidth?.(field)}
            isLastColumn={index === fields.length - 1}
          />
        ))}
        <div>
          <HandleColumDisplayButton />
          {preservedDataset.map((_data, idx) => (
            <DeleteRowIconButton
              key={idx}
              onDeleteRow={(id) => console.log(id)}
              rowId={0}
            />
          ))}
        </div>
      </ResizablePanelGroup>
      <AddRowButton />
    </div>
  );
};

export default React.memo(Table);