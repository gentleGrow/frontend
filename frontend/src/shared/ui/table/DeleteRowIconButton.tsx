import React, { memo } from "react";

const DeleteRowIconButton = ({
  onDeleteRow,
  rowId,
}: {
  rowId: number;
  onDeleteRow: (id: number) => void;
}) => {
  return (
    <button
      className="flex h-[45px] w-[44px] items-center justify-center border-b border-b-gray-10"
      onClick={() => onDeleteRow(rowId)}
      type="button"
    >
      <span className="rounded-[4px] p-2.5 hover:shadow-deleteRow">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.3957 1.81286C11.7295 1.47912 11.7295 0.938024 11.3957 0.604286C11.062 0.270548 10.5209 0.270548 10.1871 0.604286L6 4.79143L1.81286 0.604286C1.47912 0.270548 0.938024 0.270548 0.604286 0.604286C0.270548 0.938024 0.270548 1.47912 0.604286 1.81286L4.79143 6L0.604285 10.1871C0.270547 10.5209 0.270548 11.062 0.604286 11.3957C0.938024 11.7295 1.47912 11.7295 1.81286 11.3957L6 7.20857L10.1871 11.3957C10.5209 11.7295 11.062 11.7295 11.3957 11.3957C11.7295 11.062 11.7295 10.5209 11.3957 10.1871L7.20857 6L11.3957 1.81286Z"
            fill="#7A8088"
          />
        </svg>
      </span>
    </button>
  );
};

export default memo(DeleteRowIconButton);
