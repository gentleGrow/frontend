import { atom } from "jotai";

interface CellErrorAtom {
  field: string;
  rowId: number;
  message: string;
}

export const cellErrorAtom = atom<CellErrorAtom | null>(null);
