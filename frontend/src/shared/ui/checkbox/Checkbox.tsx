import React from "react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  required = false,
  onChange,
}) => {
  return (
    <label className="flex flex-1 cursor-pointer items-center space-x-1.5">
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-[2px] border ${checked ? "border-transparent bg-green-50 hover:bg-green-70" : "border-gray-30 hover:border-gray-50"} `}
      >
        {checked && (
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeWidth="3" d="M4 12l5 5L20 6"></path>
          </svg>
        )}
      </div>
      {label && (
        <span className={`text-sm font-normal text-gray-600`}>
          <span className="text-green-60">{required && "(필수) "}</span>
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomCheckbox;
