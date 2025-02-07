import { cn } from "@/lib/utils";
import { essentialFields } from "@/widgets/asset-management-draggable-table/constants/essentialFields";
import Tooltip from "@/shared/ui/Tooltip";
import Image from "next/image";
import SortingButton from "@/widgets/asset-management-draggable-table/ui/SortingButton";
import {
  FieldSortingType,
  FieldSortingTypeValue,
} from "@/widgets/asset-management-draggable-table/constants/fieldSortingType";
import { useAtomValue, useSetAtom } from "jotai";
import { sortingFieldAtom } from "@/widgets/asset-management-draggable-table/atoms/sortingFieldAtom";
import { currentSortingTypeAtom } from "../atoms/currentSortingTypeAtom";
import { fieldTypeIsNumber } from "@/widgets/asset-management-draggable-table/utils/fieldTypeIsNumber";
import { allField } from "@/entities/asset-management/constants/allField";

interface AssetManagementSheetHeaderProps {
  field: string;
}

type Field = (typeof allField)[number];

const needTooltipFields = ["수익률", "저가", "고가", "시가"] as const;

type TooltipNeedField = (typeof needTooltipFields)[number];

const checkIsTooltipNeed = (field: Field): field is TooltipNeedField => {
  // @ts-ignore -- included 호환 안됨
  if (needTooltipFields.includes(field)) {
    return true;
  }

  return false;
};

const getTooltipContent = (field: TooltipNeedField) => {
  switch (field) {
    case "수익률":
      return `주식을 매수한 평균 매입가입니다. 주가의 변동으로 처음 매입했던
            가격과 다른 가격으로 매수될 경우 평균을 내서 해당 보유 주식의 전체
            매수 가격을 표기하는 방법이에요.`;
    case "시가":
      return `매매일자 기준 가격입니다.`;
    case "저가":
      return `매매일자 기준 가격입니다.`;
    case "고가":
      return `매매일자 기준 가격입니다.`;
    default:
      throw new Error("옳바르지 않은 입력입니다.");
  }
};

const getTooltipForHeader = (field: TooltipNeedField) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className="flex h-5 w-5 items-center justify-center rounded-[4px] hover:bg-gray-10">
          <Image src={"/images/tip.svg"} width={12} height={12} alt="tip" />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>{getTooltipContent(field)}</Tooltip.Content>
    </Tooltip>
  );
};

const AssetManagementSheetHeader = ({
  field,
}: AssetManagementSheetHeaderProps) => {
  const sortingField = useAtomValue(sortingFieldAtom);
  const setSortingField = useSetAtom(sortingFieldAtom);

  const currentSortingType = useAtomValue(currentSortingTypeAtom);
  const setCurrentSorting = useSetAtom(currentSortingTypeAtom);

  let sorting: FieldSortingTypeValue = FieldSortingType.DESC;

  if (field === sortingField) {
    sorting = currentSortingType;
  }

  return (
    <div
      className={cn(
        "relative flex flex-row items-center gap-2",
        fieldTypeIsNumber(field) ? "justify-end" : "justify-start",
      )}
    >
      <span className="flex flex-row items-center gap-1">
        {field}
        {essentialFields.includes(field) && (
          <span className="text-green-60">*</span>
        )}
        {checkIsTooltipNeed(field as Field) &&
          getTooltipForHeader(field as TooltipNeedField)}
      </span>
      <SortingButton
        sorting={sorting}
        isActive={field === sortingField}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!sortingField) {
            setSortingField(field);
            setCurrentSorting(FieldSortingType.DESC);
            return;
          }

          if (field === sortingField) {
            setCurrentSorting(
              currentSortingType === FieldSortingType.ASC
                ? FieldSortingType.DESC
                : FieldSortingType.ASC,
            );
          } else {
            setSortingField(field);
            setCurrentSorting(FieldSortingType.ASC);
          }
        }}
      />
    </div>
  );
};

export default AssetManagementSheetHeader;
