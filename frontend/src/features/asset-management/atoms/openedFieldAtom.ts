import { atom } from "jotai";

export const openedFieldAtom = atom(new Set<string>());
