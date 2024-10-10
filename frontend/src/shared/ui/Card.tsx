import { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

const fontSizesVariants = {
  xl: "text-xl",
  lg: "text-lg",
  md: "text-md",
  sm: "text-sm",
};

interface CardProps {
  children: ReactNode; // children prop의 타입 정의
  title?: string;
  fontSize?: keyof typeof fontSizesVariants; // fontSize를 위한 prop 추가
  width?: string; // 너비를 위한 prop 추가
  height?: string; // 높이를 위한 prop 추가
}

export default function Card({
  children,
  title,
  width,
  height,
  fontSize = "md",
}: CardProps) {
  return (
    <div
      className="flex flex-col justify-between rounded-lg border bg-white p-4"
      style={{ width: width, height: height }}
    >
      {title && (
        <h2 className={cn("font-bold", fontSizesVariants[fontSize])}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
