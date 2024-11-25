"use client";
import { Textarea } from "@/components/ui/textarea";
import { PrimaryButton } from "@/shared";
import { Checkbox } from "@/shared/ui/checkbox/index";
import { useState } from "react";

export default function Deactivate() {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [reasonText, setReasonText] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const isReasonValid =
    selectedReason !== null && (selectedReason !== 5 || reasonText.length > 0);
  const isDisabled = !isReasonValid || !isAgreed;

  return (
    <section className="max-w-[557px]">
      <h2 className="mb-3 text-[28px] font-bold text-gray-100">회원 탈퇴</h2>
      <p className="text-sm font-medium text-gray-70">
        서비스를 이용하시는 데 불편을 드려 죄송합니다.
        <br />
        떠나시는 이유를 알려주시면, 서비스를 더 개선해 나가겠습니다.
      </p>
      <div className="mb-9 mt-6 space-y-5">
        {[
          "서비스를 잘 이용하지 않아요.",
          "서비스 사용법이 어려워요.",
          "투자를 더 이상 하지 않게 되었어요.",
          "보안이나 개인정보가 걱정돼요.",
          "오류가 자주 발생해요.",
          "기타 (직접 입력)",
        ].map((label, index) => (
          <Checkbox
            key={index}
            label={label}
            checked={selectedReason === index}
            onChange={() => setSelectedReason(index)}
          />
        ))}

        {selectedReason === 5 && (
          <div className="relative ml-6 h-[106px] rounded-lg border border-gray-20">
            <Textarea
              value={reasonText}
              maxLength={200}
              onChange={(e) => setReasonText(e.target.value)}
              className="h-[64px] min-h-0 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute bottom-[30.5px] left-1/2 h-[1px] w-[96%] -translate-x-1/2 bg-gray-10" />
            <span className="absolute bottom-[10px] right-[10px] text-body-5 text-gray-60">
              {reasonText.length}/200
            </span>
          </div>
        )}
      </div>
      <div className="mb-5 flex w-full justify-center rounded-lg bg-gray-5 py-[6px]">
        <p className="text-center text-sm font-medium leading-[20px] text-gray-80">
          탈퇴하실 경우 모든 데이터는 삭제됩니다.
          <br />
          삭제된 데이터는 복구할 수 없습니다.
        </p>
      </div>
      <div className="mb-12 rounded-lg border border-gray-20 px-4 py-[14.5px]">
        <Checkbox
          label="위 내용을 확인했고, 이에 동의합니다."
          emphasizeLabel={true}
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
        />
      </div>
      <PrimaryButton disabled={isDisabled}>탈퇴하기</PrimaryButton>
    </section>
  );
}
