export type CellKey = Readonly<string[]>;

export interface Cell<T extends CellKey[number]>
  extends Record<T, string | number> {
  id: string | number;
  isRequired?: boolean;
}

export type CellKeyList = [
  "종목명",
  "수량",
  "구매일자",
  "증권사",
  "계좌종류",
  "수익률",
  "시가",
  "고가",
  "저가",
];
