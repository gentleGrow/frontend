import React, { memo, PropsWithChildren } from "react";

const TableCell = ({ children }: PropsWithChildren) => {
  return (
    <div className="z-0 h-[44px] border-collapse overflow-visible border-b border-r border-gray-10 border-r-gray-10 text-body-2">
      {children}
    </div>
  );
};

export default memo(TableCell);
