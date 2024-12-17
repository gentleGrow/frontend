"use client";

import React, { ReactNode, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
import { CellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";
import { cn } from "@/lib/utils";
import { filedWidth } from "@/widgets/asset-management-draggable-table/constants/fieldWidth";

interface FieldState {
  isRequired: boolean;
  isChecked: boolean;
  name: string;
}

export interface TableProps<T extends unknown> {
  fields: FieldState[];
  tableWidth?: number;
  dataset: T[];
  headerBuilder: (key: string) => ReactNode;
  cellBuilder: (key: any, data: any, rowId: number | string) => ReactNode;
  onAddRow: () => void;
  onReorder: (newFields: FieldState[]) => void;
  onReset?: () => void;
  onDeleteRow: (id: number) => void;
  fixWidth?: boolean;
  fieldWidth?: (key: string) => number;
  onResize?: (fieldName: string, size: number) => void;
  errorInfo: CellErrorAtom | null;
}

const Index = <T extends unknown>({
  fields,
  tableWidth,
  dataset,
  cellBuilder,
  headerBuilder,
  onAddRow,
  onDeleteRow,
  onReorder,
  onReset,
  fieldWidth,
  fixWidth = false,
  onResize,
  errorInfo,
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
    <div ref={containerRef} className={"w-full overflow-x-scroll"}>
      <div
        className="overflow-visible rounded-[4px] border border-gray-20 bg-white"
        style={{
          width: fixWidth ? `${tableWidth}px` : "100%",
        }}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="relative z-0 overflow-hidden"
        >
          <hr className="absolute left-0 top-[42px] z-9999 h-[1px] w-full border border-gray-50 bg-gray-50" />
          {preservedUserField.map((field, index) => (
            <ResizablePanel
              key={field.name}
              className="-ml-[2px] flex flex-row"
              defaultSize={filedWidth[field.name] ?? 10}
              minSize={(filedWidth[field.name] ?? 10) / 2}
              onResize={(size) => onResize?.(field.name, size)}
              order={index}
              id={field.name}
            >
              <TableColumn
                onDrag={onDrag}
                field={field.name}
                dataset={preservedDataset}
                headerBuilder={headerBuilder}
                cellBuilder={cellBuilder}
                onDragEnd={onDragEnd}
                isDraggable={!field.isRequired}
                errorInfo={errorInfo}
              />
              <div className={cn("relative bottom-0 top-0 z-40")}>
                <div
                  className={cn(
                    "absolute bottom-[44px] top-0 z-40 w-[1px] bg-gray-30",
                    preservedFields.at(index + 1)?.name ===
                      mostClosetFromLeft && "bg-green-60",
                    mostClosetFromRight === field.name && "bg-green-60",
                  )}
                />
                <div
                  className={cn(
                    "absolute bottom-0 top-[44px] z-40 w-[1px] bg-gray-10",
                    preservedFields.at(index + 1)?.name ===
                      mostClosetFromLeft && "bg-green-60",
                    mostClosetFromRight === field.name && "bg-green-60",
                  )}
                />
              </div>
              {index !==
              fields.filter((field) => field.isChecked).length - 1 ? (
                <ResizableHandle className="relative z-50 h-[32px] translate-y-[5px] rounded-full border-none bg-transparent hover:bg-green-60 active:bg-green-60" />
              ) : (
                <div className="relative right-0 top-0 z-50 h-[32px] w-[3px] cursor-default bg-transparent" />
              )}
            </ResizablePanel>
          ))}
          <div className="-ml-[2px]">
            <HandleColumDisplayButton
              fields={fields}
              onReorder={onReorder}
              onReset={onReset}
            />
            {preservedDataset.map((_data: any, idx) => {
              return (
                <DeleteRowIconButton
                  key={_data?.id ?? idx}
                  onDeleteRow={onDeleteRow}
                  rowId={_data?.id}
                />
              );
            })}
          </div>
        </ResizablePanelGroup>
        <AddRowButton onClick={onAddRow} />
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
