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

interface FieldState {
  isRequired: boolean;
  isChecked: boolean;
  name: string;
}

export interface TableProps<T extends unknown> {
  fields: FieldState[];
  dataset: T[];
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: any, data: any) => ReactNode;
  onAddRow: () => void;
  onFieldChange: () => void;
  onReorder: (newFields: FieldState[]) => void;
  onClickFieldCheckbox: (name: string) => void;
  onDeleteRow: (id: number | string) => void;
  fixWidth?: boolean;
  fieldWidth?: (key: string) => number;
  onResize?: (fieldName: string, size: number) => void;
}

const Index = <T extends unknown>({
  fields,
  dataset,
  cellBuilder,
  headerBuilder,
  onAddRow,
  onDeleteRow,
  onFieldChange,
  onReorder,
  onClickFieldCheckbox,
  fieldWidth,
  fixWidth = false,
  onResize,
}: TableProps<T>) => {
  const [mostClosetFromRight, setMostClosetFromRight] = React.useState<
    string | null
  >(null);
  const [mostClosetFromLeft, setMostClosetFromLeft] = React.useState<
    string | null
  >(null);

  const draggingPosition = useRef<[number, number]>([0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const { updatePointer, stopAutoScroll, startAutoScroll } =
    useAutoScroll(containerRef);

  const preservedCellBuilder = usePreservedCallback(cellBuilder);
  const preservedHeaderBuilder = usePreservedCallback(headerBuilder);
  const preservedOnAddRow = usePreservedCallback(onAddRow);
  const preservedOnDeleteRow = usePreservedCallback(onDeleteRow);
  const preservedOnFieldChange = usePreservedCallback(onFieldChange);

  const preservedFields = usePreservedReference(fields);
  const preservedUserField = usePreservedReference(
    fields.filter((field) => field.isChecked),
  );

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

      const moveX = clientX - draggingPosition.current[0];

      draggingPosition.current = [clientX, clientY];

      const allColumns =
        document.querySelectorAll<HTMLDivElement>(".table-column");

      if (!allColumns) return;

      if (!containerRef.current) return;

      let minDistance = Number.MAX_SAFE_INTEGER;
      let closestColumn: string | null = null;

      allColumns.forEach((column) => {
        const { right, top, left } = column.getBoundingClientRect();

        const isPointerInColumnHeight =
          clientY > top && clientY < top + column.clientHeight;

        if (!isPointerInColumnHeight) {
          setMostClosetFromRight(null);
          return;
        }

        const distance =
          moveX > 0 ? Math.abs(clientX - right) : Math.abs(clientX - left);

        if (distance < minDistance) {
          minDistance = distance;
          closestColumn = column.id ?? null;
        }
      });

      const closestField = preservedFields.find(
        (field) => field.name === closestColumn,
      );

      if (closestColumn !== null && !closestField?.isRequired) {
        if (moveX > 0) {
          setMostClosetFromRight(closestColumn);
          setMostClosetFromLeft(null);
        } else {
          setMostClosetFromLeft(closestColumn);
          setMostClosetFromRight(null);
        }
      }
    },
    100,
  );

  const onDrag = usePreservedCallback(throttledOnDrag);

  const onDragEnd = usePreservedCallback((e: UniversalDragEvent) => {
    cancelOnDrag();
    stopAutoScroll();
    isDragging.current = false;
    setMostClosetFromLeft(null);
    setMostClosetFromRight(null);

    const targetFieldId = e.id;
    if (!targetFieldId) {
      return;
    }

    const newFields = [...fields];
    const targetIndex = newFields.findIndex(
      (field) => field.name === targetFieldId,
    );

    if (targetIndex === -1) {
      return;
    }

    let insertIndex: number = -1;

    if (mostClosetFromRight) {
      const insertAfterIndex = newFields.findIndex(
        (field) => field.name === mostClosetFromRight,
      );

      if (insertAfterIndex === -1) {
        return;
      }

      insertIndex = insertAfterIndex + 1;
    } else if (mostClosetFromLeft) {
      const insertBeforeIndex = newFields.findIndex(
        (field) => field.name === mostClosetFromLeft,
      );

      if (insertBeforeIndex === -1) {
        return;
      }

      insertIndex = insertBeforeIndex;
    } else {
      // 둘 다 없으면 삽입할 위치가 없으므로 함수 종료
      return;
    }

    const targetField = newFields[targetIndex];

    // 기존 위치에서 요소 제거
    newFields.splice(targetIndex, 1);

    // targetIndex가 제거되면서 인덱스에 변화가 있으므로 조정
    if (targetIndex < insertIndex) {
      insertIndex -= 1;
    }

    // 새로운 위치에 요소 삽입
    newFields.splice(insertIndex, 0, targetField);

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
          {preservedUserField.map((field, index) => (
            <TableColumn
              key={field.name}
              onDrag={onDrag}
              index={index}
              field={field.name}
              onResize={onResize}
              dataset={preservedDataset}
              headerBuilder={preservedHeaderBuilder}
              cellBuilder={preservedCellBuilder}
              fieldWidth={fieldWidth?.(field.name)}
              isLastColumn={index === fields.length - 1}
              onDragEnd={onDragEnd}
              isClosestFromRight={field.name === mostClosetFromRight}
              isClosestFromLeft={field.name === mostClosetFromLeft}
              isDraggable={!field.isRequired}
            />
          ))}
          <div>
            <HandleColumDisplayButton
              fields={preservedFields}
              onClickFieldCheckbox={onClickFieldCheckbox}
              onReorder={onReorder}
            />
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
