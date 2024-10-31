import { atom } from "jotai";
import {
  FieldSortingType,
  FieldSortingTypeValue,
} from "@/widgets/asset-management-draggable-table/constants/fieldSortingType";

export const currentSortingTypeAtom = atom<FieldSortingTypeValue>(
  FieldSortingType.DESC,
);
