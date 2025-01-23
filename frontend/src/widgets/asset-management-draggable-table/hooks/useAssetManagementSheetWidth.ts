import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cellMinimumWidth } from "@/widgets/asset-management-draggable-table/constants/cellMinimumWidth";
import { useState } from "react";
import { filedDefaultWidth } from "@/widgets/asset-management-draggable-table/constants/fieldWidth";

export const useAssetManagementSheetWidth = (fieldList: string[]) => {
  const [fieldSize, setFieldSize] = useState(filedDefaultWidth);

  const windowWidth = useWindowWidth();

  const tableMinimumWidth = Object.keys(fieldList).reduce((acc, key) => {
    return acc + (cellMinimumWidth[key] ?? 136) * 1.5;
  }, 0);

  const isFixed = windowWidth - 40 - tableMinimumWidth < 0;

  const resizeFieldSize = (field: string, size: number) => {
    setFieldSize((prev) => ({
      ...prev,
      [field]: size,
    }));
  };

  return {
    // TODO: fieldSize 로 나중에 리사이즈된 사이즈 영구 저장하는 기능을 구현하기
    fieldSize,
    isFixed,
    tableMinimumWidth,
    resizeFieldSize,
  };
};
