"use client";
import { DonutChart, SegmentedButton, SegmentedButtonGroup } from "@/shared";
const data = [
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
export default function StockComposition() {
  return (
    <div className="relative w-full max-w-[558px] rounded-xl border p-[16px] mobile:h-[642px]">
      <h2 className="text-heading-2">종목 구성</h2>
      <div className="mt-[16px] flex w-full except-mobile:absolute except-mobile:right-[16px] except-mobile:top-[12px] except-mobile:mt-0 except-mobile:w-fit">
        <SegmentedButtonGroup>
          <SegmentedButton>종목별</SegmentedButton>
          <SegmentedButton>계좌별</SegmentedButton>
        </SegmentedButtonGroup>
      </div>
      <div className="mt-[48px] mobile:mt-[20px]">
        <DonutChart chartName="종목 구성" data={data} />
      </div>
    </div>
  );
}
