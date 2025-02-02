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
      className="relative flex min-h-[42px] w-[90%] min-w-[330px] max-w-[720px] items-center justify-center rounded-[20px] bg-gradient-to-b from-[#05D665] to-[#5DF1CD] pl-5 pr-[60px] font-bold text-white transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      <p className="w-full truncate text-[14px] leading-[21px]">{children}</p>
      <div className="absolute right-5 top-1/2 -translate-y-1/2">
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
