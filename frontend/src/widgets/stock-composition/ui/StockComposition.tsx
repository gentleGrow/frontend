"use client";
import { DonutChart, SegmentedButton, SegmentedButtonGroup } from "@/shared";
import { useState } from "react";
const data1 = [
  { value: 1234, name: "Apple", percent: 10.12 },
  { value: 1233, name: "AAA", percent: 10.01 },
  { value: 1232, name: "AAAAAA", percent: 10.01 },
  { value: 1231, name: "AAAAAAAAAA", percent: 10.01 },
  { value: 1230, name: "AAAAAAAAAAA", percent: 10.01 },
  { value: 1229, name: "AAAAAAAAAAAA", percent: 10.01 },
  { value: 1228, name: "AAAAAAAAAAAAA", percent: 10.01 },
  { value: 1227, name: "AAAAAAAAAAAAAA", percent: 10.01 },
  { value: 1226, name: "AAAAAAAAAAAAAAA", percent: 10.01 },
  { value: 1225, name: "기타", percent: 10.01 },
];
const data2 = [
  { value: 987, name: "Orange", percent: 12.34 },
  { value: 876, name: "BBB", percent: 11.56 },
  { value: 765, name: "BBBBBB", percent: 9.87 },
  { value: 654, name: "CCCCCCCCCC", percent: 8.76 },
  { value: 543, name: "CCCCCCCCCCC", percent: 7.65 },
  { value: 432, name: "DDDDDDDDDDDD", percent: 6.54 },
  { value: 321, name: "EEEEEEEEEEEE", percent: 5.43 },
  { value: 210, name: "FFFFFFFFFFFF", percent: 4.32 },
  { value: 109, name: "GGGGGGGGGGGGG", percent: 3.21 },
  { value: 98, name: "Others", percent: 2.1 },
];
export default function StockComposition() {
  const [currentData, setCurrentData] = useState<any[]>(data1);
  return (
    <div className="relative w-full max-w-[558px] rounded-xl border p-[16px] mobile:h-[642px] mobile:border-none">
      <h2 className="text-heading-2">종목 구성</h2>
      <div className="mt-[16px] flex w-full except-mobile:absolute except-mobile:right-[16px] except-mobile:top-[12px] except-mobile:mt-0 except-mobile:w-[148px]">
        <SegmentedButtonGroup>
          <SegmentedButton onClick={() => setCurrentData(data1)}>
            종목별
          </SegmentedButton>
          <SegmentedButton onClick={() => setCurrentData(data2)}>
            계좌별
          </SegmentedButton>
        </SegmentedButtonGroup>
      </div>
      <div className="mt-[48px] mobile:mt-[20px]">
        <DonutChart chartName="종목 구성" data={currentData} />
      </div>
    </div>
  );
}
