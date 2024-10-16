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
}

const TableHeader = ({
  children,
  onDragEnd,
  onDrag,
  field,
}: PropsWithChildren<TableHeaderProps>) => {
  const ref = React.useRef<HTMLHeadElement>(null);
  return (
    <header
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
      className={cn(
        "relative h-[44px] border-collapse cursor-grab border-r border-gray-30 px-2.5 py-[12.5px] text-body-2 font-semibold",
      )}
    >
      {children}
    </header>
  );
};

export default memo(TableHeader);
