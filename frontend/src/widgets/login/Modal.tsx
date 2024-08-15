import { Heading, Text } from "@/shared";
import Close from "./Close";

export default function Modal() {
  return (
    <div className="fixed left-1/2 top-1/2 flex h-full max-h-[562px] w-full max-w-[474px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-white px-[36px]">
      <div className="mb-[12px] flex w-full justify-end">
        <Close />
      </div>
      <div className="space-y-[16px] text-center">
        <Heading fontSize="2xl">시작하기</Heading>
        <Text fontSize="md">
          투자 현황을 기록하고 분석해 더 나은 투자를 만들어 갑니다. 간편
          로그인으로 쉽고 빠르게 서비스를 시작하세요.
        </Text>
      </div>
      <div className="space-y-[24px]"></div>
    </div>
  );
}
