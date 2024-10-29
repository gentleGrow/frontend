import React, { memo, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import {
  UniversalDragEvent,
  useDragAndDrop,
} from "@/shared/hooks/useDragAndDrop";

interface TableHeaderProps {
  onDragEnd: (e: UniversalDragEvent) => void;
  onDrag: (e: UniversalDragEvent) => void;
  field: string;
  isDraggable: boolean;
}

const DraggableTableHeader = ({
  children,
  onDragEnd,
  onDrag,
  field,
}: PropsWithChildren<Omit<TableHeaderProps, "isDraggable">>) => {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <header
      className={cn(
        "z-0 h-[44px] overflow-visible border-r border-gray-30 px-2.5 py-[12.5px]",
      )}
    >
      <div
        ref={ref}
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
        id={field}
        data-key={field}
        {...useDragAndDrop({
          onDragEnd,
          onDrag,
          ref,
        })}
        className="group h-full w-full border-collapse cursor-grab text-body-2 font-semibold"
      >
        {children}
      </div>
    </header>
  );
};

const NotDraggableTableHeader = ({
  children,
  field,
}: PropsWithChildren<Pick<TableHeaderProps, "field">>) => {
  return (
    <header
      className={cn(
        "z-0 h-[44px] border-collapse overflow-visible border-r border-gray-30 px-2.5 py-[12.5px]",
      )}
    >
      <div
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
        className={"group h-full w-full text-body-2 font-semibold"}
        id={field}
        data-key={field}
      >
        {children}
      </div>
    </header>
  );
};

const TableHeader = ({
  isDraggable,
  ...props
}: PropsWithChildren<TableHeaderProps>) => {
  if (isDraggable) {
    return (
      <DraggableTableHeader {...props}>{props.children}</DraggableTableHeader>
    );
  }

  return (
    <NotDraggableTableHeader {...props}>
      {props.children}
    </NotDraggableTableHeader>
  );
};

export default memo(TableHeader);
