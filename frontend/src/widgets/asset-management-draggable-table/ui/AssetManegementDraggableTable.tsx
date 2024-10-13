"use client";

import Table from "@/shared/ui/table/Table";
import { useWindowWidth } from "@/shared/hooks/useWindowWidth";
import { cn } from "@/lib/utils";

const fieldList = [
  "종목명",
  "수량",
  "구매일자",
  "증권사",
  "계좌종류",
  "수익률",
  "시가",
  "고가",
  "저가",
] as const;

const partialFieldList = ["종목명", "계좌종류", "수익률"] as const;

const item1 = {
  id: 0,
  종목명: "삼성전자",
  수량: 100,
  구매일자: "2021-01-01",
  증권사: "키움증권",
  계좌종류: "주식",
  수익률: 0.1,
  시가: 1000,
  고가: 1100,
  저가: 900,
};

const item2 = {
  id: 1,
  종목명: "LG전자",
  수량: 200,
  구매일자: "2021-01-01",
  증권사: "키움증권",
  계좌종류: "주식",
  수익률: 0.1,
  시가: 1000,
  고가: 1100,
  저가: 900,
};

const filedWidth: Partial<Record<(typeof fieldList)[number], number>> = {
  종목명: 12,
  계좌종류: 9,
  수익률: 8,
};

const tableData = [item1, item2];
const minimumWidth = 80;

const AssetManegementDraggableTable = () => {
  const windowWidth = useWindowWidth();

  const isFixed = windowWidth / partialFieldList.length < minimumWidth * 1.5;

  const cellBuilder = (key: string, data: string | number) => (
    <input
      className={cn(
        "box-border h-full w-full px-2.5 py-[12.5px] focus:outline-green-50",
        typeof data[key] === "number" ? "text-right" : "text-start",
      )}
      defaultValue={String(data[key] ?? "")}
    />
  );

  const headerBuilder = (key: string) => (
    <div
      className={cn(
        "text-right",
        typeof tableData[0][key] === "number" ? "text-right" : "text-start",
      )}
    >
      {key}
    </div>
  );

  return (
    <div className={"w-full overflow-x-auto scrollbar-hide"}>
      <Table
        fixWidth={isFixed}
        fields={partialFieldList}
        dataset={tableData}
        headerBuilder={headerBuilder}
        cellBuilder={cellBuilder}
        allFields={fieldList}
        fieldWidth={(key) => filedWidth[key]}
        onFieldChane={() => {}}
        onAddRow={() => {}}
        onDeleteRow={() => {}}
      />
    </div>
  );
};

export default AssetManegementDraggableTable;
