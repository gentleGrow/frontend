import React, { useId } from "react";
import { cn } from "@/lib/utils";

const CheckBox = <T,>(props: Omit<React.InputHTMLAttributes<T>, "type">) => {
  const id = useId();
  return (
    <label htmlFor={id}>
      <div
        className={cn(
          "flex h-[16px] w-[16px] items-center justify-center rounded-[2px]",
          props.checked
            ? "bg-green-60 hover:bg-green-70"
            : "border border-gray-30 hover:border-gray-50",
          props.disabled ? "bg-gray-30 hover:bg-gray-30" : "",
        )}
      >
        {/*@ts-ignore*/}
        <input id={id} type="checkbox" className="hidden" {...props} />
        {props.checked && (
          <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5.19355L4.22581 8.09677L11 1"
              stroke={props.disabled ? "#EFF0F1" : "white"}
              strokeWidth="1.75"
            />
          </svg>
        )}
      </div>
    </label>
  );
};

export default CheckBox;
