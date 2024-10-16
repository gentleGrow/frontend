"use client";

import React, { ReactNode, useRef } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import TableColumn from "@/shared/ui/table/TableColumn";
import DeleteRowIconButton from "@/shared/ui/table/DeleteRowIconButton";
import { usePreservedCallback } from "@/shared/hooks/usePreservedCallback";
import { usePreservedReference } from "@/shared/hooks/usePreservedRef";
import HandleColumDisplayButton from "@/shared/ui/table/HandleColumDisplayButton";
import AddRowButton from "@/shared/ui/table/AddRowButton";
import { useThrottle } from "@/shared/hooks/useThrottle";
import {
  DragProvider,
  UniversalDragEvent,
} from "@/shared/hooks/useDragAndDrop";
import useAutoScroll from "@/shared/hooks/useAutoScroll";

export interface TableProps<T extends unknown> {
  fields: string[];
  dataset: T[];
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: any, data: any) => ReactNode;
  onAddRow: () => void;
  onFieldChane: () => void;
  onReorder: (newFields: string[]) => void;
  onDeleteRow: (id: number | string) => void;
  fixWidth?: boolean;
  fieldWidth?: (key: string) => number;
  onResize?: (field: string, size: number) => void;
}

const Index = <T extends unknown>({
  fields,
  dataset,
  cellBuilder,
  headerBuilder,
  onAddRow,
  onDeleteRow,
  onFieldChane,
  onReorder,
  fieldWidth,
  fixWidth = false,
  onResize,
}: TableProps<T>) => {
  const [mostClosetFromRight, setMostClosetFromRight] = React.useState<
    string | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const { updatePointer, stopAutoScroll, startAutoScroll } =
    useAutoScroll(containerRef);

  const preservedCellBuilder = usePreservedCallback(cellBuilder);
  const preservedHeaderBuilder = usePreservedCallback(headerBuilder);
  const preservedOnAddRow = usePreservedCallback(onAddRow);
  const preservedOnDeleteRow = usePreservedCallback(onDeleteRow);
  const preservedOnFieldChange = usePreservedCallback(onFieldChane);

  const preservedFields = usePreservedReference(fields);
  const preservedDataset = usePreservedReference(dataset);

  const { throttledFn: throttledOnDrag, cancel: cancelOnDrag } = useThrottle(
    (e: UniversalDragEvent) => {
      const { clientX, clientY } = e;

      if (!isDragging.current) {
        isDragging.current = true;
        startAutoScroll();
      } else {
        updatePointer(clientX);
      }

      const allColumns =
        document.querySelectorAll<HTMLDivElement>(".table-column");

      if (!allColumns) return;

      if (!containerRef.current) return;

      let minDistance = Number.MAX_SAFE_INTEGER;
      let closestColumn: string | null = null;

      allColumns.forEach((column) => {
        const { right, top } = column.getBoundingClientRect();

        const isPointerInColumnHeight =
          clientY > top && clientY < top + column.clientHeight;

        if (!isPointerInColumnHeight) {
          setMostClosetFromRight(null);
          return;
        }

        const distance = Math.abs(clientX - right);

        if (distance < minDistance) {
          minDistance = distance;
          closestColumn = column.id ?? null;
        }
      });

      if (closestColumn !== null) {
        setMostClosetFromRight(closestColumn);
      }
    },
    100,
  );

  const onDrag = usePreservedCallback(throttledOnDrag);

  const onDragEnd = usePreservedCallback((e: UniversalDragEvent) => {
    cancelOnDrag();
    stopAutoScroll();
    isDragging.current = false;
    setMostClosetFromRight(null);
    const targetField = e.id;
    const insertAfterField = mostClosetFromRight;

    if (targetField === insertAfterField) {
      return;
    }

    if (!targetField || !insertAfterField) {
      return;
    }

    if (!mostClosetFromRight) return;

    const newFields = [...fields];
    const targetIndex = newFields.indexOf(targetField);
    const insertAfterIndex = newFields.indexOf(insertAfterField);

    newFields.splice(targetIndex, 1);

    // 오른쪽에 삽입하기 위해 인덱스를 조정
    const newIndex =
      insertAfterIndex >= targetIndex ? insertAfterIndex : insertAfterIndex + 1;

    newFields.splice(newIndex, 0, targetField);

    // 새로운 필드 순서를 적용
    onReorder(newFields);
  });

  return (
    <div
      ref={containerRef}
      className={"w-full overflow-x-scroll scrollbar-hide"}
    >
      <div
        className="rounded-[4px] border border-gray-20 bg-white"
        style={{
          width: fixWidth ? "1360px" : "100%",
        }}
      >
        <ResizablePanelGroup direction="horizontal" className="relative">
          <hr className="absolute left-0 top-[42px] z-50 h-[1px] w-full border border-gray-50 bg-gray-50" />
          {preservedFields.map((field, index) => (
            <TableColumn
              key={field}
              onDrag={onDrag}
              index={index}
              field={field}
              onResize={onResize}
              dataset={preservedDataset}
              headerBuilder={preservedHeaderBuilder}
              cellBuilder={preservedCellBuilder}
              fieldWidth={fieldWidth?.(field)}
              isLastColumn={index === fields.length - 1}
              onDragEnd={onDragEnd}
              isClosestFromRight={field === mostClosetFromRight}
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
    </div>
  );
};

const Table = <T extends unknown>(props: TableProps<T>) => {
  return (
    <DragProvider>
      <Index {...props} />
    </DragProvider>
  );
};

export default React.memo(Table);
