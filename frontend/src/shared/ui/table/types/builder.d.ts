import { Cell, CellKey } from "@/shared/ui/table/types/cell";
import { ReactNode } from "react";

export type CellBuilder<T extends CellKey[number]> = (
  key: CellKey[number],
  data: Cell<T[number]>,
) => ReactNode;

export type HeaderBuilder<T extends CellKey[number]> = (
  key: CellKey[number],
) => ReactNode;
