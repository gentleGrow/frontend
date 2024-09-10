import React, { ReactNode, useState } from "react";
import { SegmentedButtonProps } from "../types/component-props";

export default function SegmentedButtonGroup({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const childrenArray = React.Children.toArray(children);
  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <div className="flex space-x-2 rounded-md bg-gray-10 p-[4px]">
      {childrenArray.map((child, index) => {
        if (React.isValidElement<SegmentedButtonProps>(child)) {
          return React.cloneElement(child, {
            isSelected: selectedIndex === index,
            onClick: () => handleClick(index),
          });
        }
        return child;
      })}
    </div>
  );
}
