import { useEffect, useMemo, useRef, useState } from "react";
import { ItemName } from "@/entities/assetManagement/apis/getItemNameList";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import Fuse from "fuse.js";

interface ItemNameCellProps {
  selected?: string | null;
  onSelect: (name: ItemName) => void;
  selections: ItemName[];
}

const ItemNameCell = ({
  selected,
  onSelect,
  selections,
}: ItemNameCellProps) => {
  const [typedName, setTypedName] = useState(selected ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);
  const [popupStyle, setPopupStyle] = useState({});

  const inputRect = inputRef.current?.getBoundingClientRect();

  const options = useMemo(
    () => ({
      keys: ["name"], // 검색할 키
      threshold: 0.3, // 일치율 (0.0 ~ 1.0), 낮을수록 정확한 매칭
    }),
    [],
  );

  const fuse = useMemo(
    () => new Fuse(selections, options),
    [selections, options],
  );

  const filteredSelections = useMemo(() => {
    if (!typedName.trim()) {
      return [];
    }
    return fuse
      .search(typedName)
      .map((result) => result.item)
      .slice(0, 10);
  }, [typedName, fuse]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      setPopupStyle({
        position: "absolute",
        top: (inputRect?.bottom ?? 0) + window.scrollY,
        left: (inputRect?.left ?? 0) + window.scrollX,
        width: inputRect?.width ?? 0,
        zIndex: 9999,
      });
    }
  }, [
    isFocused,
    setPopupStyle,
    inputRect?.width,
    inputRect?.bottom,
    inputRect?.left,
  ]);

  useEffect(() => {
    if (isFocused) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          popupRef.current &&
          !popupRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isFocused]);

  return (
    <label className="relative h-full w-full">
      <input
        ref={inputRef}
        value={typedName ?? ""}
        onChange={(e) => setTypedName(e.target.value)}
        className="h-full w-full px-2.5 py-[10.5px] text-body-2 text-gray-90 focus:outline-green-60"
        onFocus={() => {
          setIsFocused(true);
        }}
      />
      {isFocused &&
        createPortal(
          <ul
            style={{
              ...popupStyle,
            }}
            ref={popupRef}
            className="flex w-full flex-col rounded-[12px] border border-gray-20 bg-white p-2 shadow shadow-popover"
          >
            {filteredSelections.map((item) => (
              <li
                className={cn(
                  "group relative flex flex-row items-center gap-1 px-2 py-[7.5px] font-normal",
                  selected === item.name && "bg-gray-5",
                )}
                onClick={(e) => {
                  onSelect(item);
                  setTypedName(item.name);
                  setIsFocused(false);
                }}
                key={item.code}
              >
                <span
                  className={
                    "line-clamp-1 text-body-2 text-gray-90 group-hover:font-semibold"
                  }
                >
                  {item.name}
                </span>
                <span
                  className={
                    "w-fit shrink-0 text-[11px] text-gray-50 group-hover:font-semibold"
                  }
                >
                  {item.code}
                </span>
                {selected === item.name && (
                  <div
                    className={
                      "absolute left-0 right-0 h-full w-[2px] bg-green-60"
                    }
                  />
                )}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </label>
  );
};

export default ItemNameCell;
