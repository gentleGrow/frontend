"use client";

import Tag from "@/shared/ui/Tag";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface AccountTypeCellProps {
  selected?: string | null;
  onSelect: (name: string) => void;
  selections: string[];
  icon?: boolean;
}

const AccountTypeCell = ({
  selected,
  onSelect,
  selections,
  icon = false,
}: AccountTypeCellProps) => {
  const [open, setOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);

  const containerRect = containerRef.current?.getBoundingClientRect();

  useEffect(() => {
    if (open && containerRef.current) {
      setPopupStyle({
        position: "absolute",
        top: (containerRect?.bottom ?? 0) + window.scrollY,
        left: (containerRect?.left ?? 0) + window.scrollX,
        width: containerRect?.width ?? 0,
        zIndex: 9999,
      });
    }
  }, [open, containerRect?.width, containerRect?.bottom, containerRect?.left]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full px-2.5 py-2">
      <Tag
        padding={icon ? "medium" : "small"}
        trailingIcon={true}
        onClick={() => setOpen((prev) => !prev)}
      >
        {icon ? (
          <div className="flex flex-row items-center gap-0.5">
            <MoneyIcon />
            <span className="line-clamp-1 w-full overflow-hidden text-body-2">
              {selected ?? ""}
            </span>
          </div>
        ) : (
          <>{selected ?? ""}</>
        )}
      </Tag>
      {open &&
        createPortal(
          <ul
            style={{
              ...popupStyle,
            }}
            ref={popupRef}
            className="flex max-h-[390px] flex-col gap-1.5 overflow-y-auto overflow-x-hidden rounded-[12px] border border-gray-20 bg-white p-2 shadow shadow-popover"
          >
            {selections.map((selection) => (
              <li
                key={selection}
                className={cn(
                  "group relative w-full overflow-x-hidden px-2 py-0.5",
                  selected === selection && "bg-gray-5",
                )}
              >
                <Tag
                  removeHoverEffect
                  padding={icon ? "small" : "medium"}
                  onClick={() => {
                    onSelect(selection);
                    setOpen(false);
                  }}
                >
                  {icon ? (
                    <div className="flex flex-row items-center gap-0.5">
                      <MoneyIcon />
                      <span className="line-clamp-1 w-full overflow-hidden text-body-2 group-hover:font-bold">
                        {selection}
                      </span>
                    </div>
                  ) : (
                    <span className="text-body-2 group-hover:font-bold">
                      {selection}
                    </span>
                  )}
                </Tag>
                {selected === selection && (
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-green-60" />
                )}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};

function MoneyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_977_1267"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_977_1267)">
        <path
          d="M8.00004 14.6668C7.07782 14.6668 6.21115 14.4918 5.40004 14.1418C4.58893 13.7918 3.88337 13.3168 3.28337 12.7168C2.68337 12.1168 2.20837 11.4113 1.85837 10.6002C1.50837 9.78905 1.33337 8.92238 1.33337 8.00016C1.33337 7.07794 1.50837 6.21127 1.85837 5.40016C2.20837 4.58905 2.68337 3.8835 3.28337 3.2835C3.88337 2.6835 4.58893 2.2085 5.40004 1.8585C6.21115 1.5085 7.07782 1.3335 8.00004 1.3335C8.92226 1.3335 9.78893 1.5085 10.6 1.8585C11.4112 2.2085 12.1167 2.6835 12.7167 3.2835C13.3167 3.8835 13.7917 4.58905 14.1417 5.40016C14.4917 6.21127 14.6667 7.07794 14.6667 8.00016C14.6667 8.92238 14.4917 9.78905 14.1417 10.6002C13.7917 11.4113 13.3167 12.1168 12.7167 12.7168C12.1167 13.3168 11.4112 13.7918 10.6 14.1418C9.78893 14.4918 8.92226 14.6668 8.00004 14.6668ZM7.98337 12.6668C8.13893 12.6668 8.27504 12.6085 8.39171 12.4918C8.50837 12.3752 8.56671 12.2391 8.56671 12.0835V11.8335C9.12226 11.7335 9.60004 11.5168 10 11.1835C10.4 10.8502 10.6 10.3557 10.6 9.70016C10.6 9.2335 10.4667 8.80572 10.2 8.41683C9.93337 8.02794 9.40004 7.68905 8.60004 7.40016C7.93337 7.17794 7.47226 6.9835 7.21671 6.81683C6.96115 6.65016 6.83337 6.42238 6.83337 6.1335C6.83337 5.84461 6.93615 5.61683 7.14171 5.45016C7.34726 5.2835 7.64448 5.20016 8.03337 5.20016C8.2556 5.20016 8.45004 5.23905 8.61671 5.31683C8.78337 5.39461 8.92226 5.50016 9.03337 5.6335C9.14448 5.76683 9.26948 5.8585 9.40837 5.9085C9.54726 5.9585 9.67782 5.95572 9.80004 5.90016C9.96671 5.8335 10.0806 5.71961 10.1417 5.5585C10.2028 5.39738 10.1889 5.25016 10.1 5.11683C9.92226 4.86127 9.70282 4.64461 9.44171 4.46683C9.1806 4.28905 8.90004 4.18905 8.60004 4.16683V3.91683C8.60004 3.76127 8.54171 3.62516 8.42504 3.5085C8.30837 3.39183 8.17226 3.3335 8.01671 3.3335C7.86115 3.3335 7.72504 3.39183 7.60837 3.5085C7.49171 3.62516 7.43337 3.76127 7.43337 3.91683V4.16683C6.87782 4.28905 6.44449 4.5335 6.13337 4.90016C5.82226 5.26683 5.66671 5.67794 5.66671 6.1335C5.66671 6.65572 5.81948 7.07794 6.12504 7.40016C6.4306 7.72238 6.91115 8.00016 7.56671 8.2335C8.26671 8.48905 8.75282 8.71683 9.02504 8.91683C9.29726 9.11683 9.43337 9.37794 9.43337 9.70016C9.43337 10.0668 9.30282 10.3363 9.04171 10.5085C8.7806 10.6807 8.46671 10.7668 8.10004 10.7668C7.81115 10.7668 7.55004 10.6974 7.31671 10.5585C7.08337 10.4196 6.88893 10.2113 6.73337 9.9335C6.64448 9.77794 6.52782 9.67238 6.38337 9.61683C6.23893 9.56127 6.09448 9.56127 5.95004 9.61683C5.79449 9.67238 5.6806 9.77794 5.60837 9.9335C5.53615 10.0891 5.53337 10.2391 5.60004 10.3835C5.77782 10.7613 6.01671 11.0696 6.31671 11.3085C6.61671 11.5474 6.97782 11.7113 7.40004 11.8002V12.0835C7.40004 12.2391 7.45837 12.3752 7.57504 12.4918C7.69171 12.6085 7.82782 12.6668 7.98337 12.6668Z"
          fill="#B9BCC1"
        />
      </g>
    </svg>
  );
}

export default AccountTypeCell;
