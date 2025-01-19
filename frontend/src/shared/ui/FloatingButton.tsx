import { ReactNode } from "react";

export default function FloatingButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className="relative mx-4 flex min-h-[42px] w-max shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#05D665] to-[#5DF1CD] px-[105px] py-[9px] font-bold text-white transition-shadow hover:shadow-lg mobile:w-[90%]"
      onClick={onClick}
    >
      <p className="flex"> {children}</p>

      <div className="absolute right-[20px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1924 4.22183L17.9706 12L10.1924 19.7782"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}
