import { atom } from "jotai";

export interface CellErrorAtom {
  field: string;
  rowId: number | string;
  message: string;
  value?: unknown;
}

export const cellErrorAtom = atom<CellErrorAtom | null>(null);
