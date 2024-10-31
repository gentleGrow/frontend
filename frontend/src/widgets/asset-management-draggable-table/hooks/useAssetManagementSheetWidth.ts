import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cellMinimumWidth } from "@/widgets/asset-management-draggable-table/constants/cellMinimumWidth";
import { useState } from "react";
import { filedWidth } from "@/widgets/asset-management-draggable-table/constants/fieldWidth";

export const useAssetManagementSheetWidth = () => {
  const [fieldSize, setFieldSize] = useState(filedWidth);

  const windowWidth = useWindowWidth();

  const tableMinimumWidth = Object.keys(fieldSize).reduce((acc, key) => {
    return acc + (cellMinimumWidth[key] ?? 136);
  }, 0);

  const isFixed = windowWidth - 40 - tableMinimumWidth < 0;

  const resizeFieldSize = (field: string, size: number) => {
    setFieldSize((prev) => ({
      ...prev,
      [field]: size,
    }));
  };

  return {
    fieldSize,
    tableMinimumWidth,
    isFixed,
    resizeFieldSize,
  };
};
