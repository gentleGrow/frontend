import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface DragContextValue {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  id: MutableRefObject<string | null>;
}

export const DragContext = createContext<DragContextValue | null>(null);

export const DragProvider = ({ children }: PropsWithChildren) => {
  const [isDragging, setIsDragging] = useState(false);
  const id = useRef<string | null>(null);

  return (
    <DragContext.Provider value={{ isDragging, setIsDragging, id }}>
      {children}
    </DragContext.Provider>
  );
};

export interface UniversalDragEvent {
  clientX: number;
  clientY: number;
  id: string;
}

interface UseDragAndDrop {
  onDragStart?: (event: UniversalDragEvent) => void;
  onDrag?: (event: UniversalDragEvent) => void;
  onDragEnd?: (event: UniversalDragEvent) => void;
  ref: RefObject<HTMLElement>;
}

export const useDragAndDrop = ({
  onDragStart,
  onDrag,
  onDragEnd,
  ref,
}: UseDragAndDrop) => {
  const context = useContext(DragContext);
  const draggingClone = useRef<HTMLElement | null>(null);
  const origin = useRef<HTMLElement | null>(null);

  if (!context)
    throw new Error("useDragAndDrop must be used within a DragProvider");

  if (!ref) throw new Error("ref is required");

  const { id } = context;

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!id.current) return;
      if (!draggingClone.current) return;

      const { clientX, clientY } = e;

      const width = draggingClone.current?.getBoundingClientRect().width ?? 1;
      const height = draggingClone.current?.getBoundingClientRect().height ?? 1;

      draggingClone.current?.style.setProperty(
        "left",
        `${clientX - width / 2}px`,
      );
      draggingClone.current?.style.setProperty(
        "top",
        `${clientY - height / 2}px`,
      );
      onDrag?.({
        clientX: e.clientX,
        clientY: e.clientY,
        id: id.current,
      });
    },
    [onDrag, id],
  );

  const onPointerUp = (e: PointerEvent) => {
    if (!id.current) return;

    origin?.current?.style.setProperty("background", "white");

    const draggingArea = document.getElementById("drag-overlay");
    if (!draggingArea) return;

    if (e.pointerType === "touch") {
      ref.current?.releasePointerCapture(e.pointerId);
      ref?.current?.removeEventListener("pointermove", onPointerMove);
      ref.current?.removeEventListener("pointerup", onPointerUp);
    } else {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }

    draggingClone.current?.remove();
    onDragEnd?.({
      clientX: e.clientX,
      clientY: e.clientY,
      id: id.current,
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    ref?.current?.style.setProperty("background", "rgba(239, 240, 241, 1)");

    const draggingArea = document.getElementById("drag-overlay");
    if (!draggingArea) return;

    draggingClone.current = ref?.current?.cloneNode(true) as HTMLElement;
    origin.current = ref?.current;
    // check if is touch event
    if (e.pointerType === "touch") {
      ref?.current?.setPointerCapture(e.pointerId);
      ref?.current?.addEventListener("pointermove", onPointerMove);
      ref?.current?.addEventListener("pointerup", onPointerUp);
    } else {
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    draggingArea.appendChild(draggingClone.current);

    draggingClone.current?.style.setProperty("position", "fixed");
    draggingClone.current?.style.setProperty(
      "width",
      `${e.currentTarget.offsetWidth}px`,
    );
    draggingClone.current?.style.setProperty(
      "height",
      `${e.currentTarget.offsetHeight}px`,
    );
    draggingClone.current?.style?.setProperty(
      "background",
      "rgba(255, 255, 255, 0.8)",
    );
    draggingClone.current?.style?.setProperty("border", "none");
    draggingClone.current?.style.setProperty(
      "box-shadow",
      "1px 1px 6px 0px rgba(0, 0, 0, 0.15)",
    );

    const { clientX, clientY } = e;
    const width = draggingClone.current?.getBoundingClientRect().width ?? 1;
    const height = draggingClone.current?.getBoundingClientRect().height ?? 1;

    draggingClone.current?.style.setProperty(
      "left",
      `${clientX - width / 2}px`,
    );

    draggingClone.current?.style.setProperty(
      "top",
      `${clientY - height / 2}px`,
    );
    draggingClone.current?.style.setProperty("z-index", "1000");

    id.current = e.currentTarget.id;
    onDragStart?.({
      clientX: e.clientX,
      clientY: e.clientY,
      id: id.current,
    });
  };

  return {
    onPointerDown,
  };
};
