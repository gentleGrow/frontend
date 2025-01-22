import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { cellErrorAtom } from "../atoms/cellErrorAtom";
import { currentSortingTypeAtom } from "../atoms/currentSortingTypeAtom";
import { sortingFieldAtom } from "../atoms/sortingFieldAtom";

export const useInitializeAtoms = () => {
  const setCellErrorAtom = useSetAtom(cellErrorAtom);
  const setCurrentSortingTypeAtom = useSetAtom(currentSortingTypeAtom);
  const setSortingFieldAtom = useSetAtom(sortingFieldAtom);

  useEffect(() => {
    setCellErrorAtom(null);
    setCurrentSortingTypeAtom("desc");
    setSortingFieldAtom(null);
  }, [setCellErrorAtom, setCurrentSortingTypeAtom, setSortingFieldAtom]);
};
