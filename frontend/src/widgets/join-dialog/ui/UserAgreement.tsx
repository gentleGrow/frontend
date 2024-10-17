"use client";
import { LineButton, PrimaryButton } from "@/shared";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/shared/ui/checkbox";
export default function UserAgreement() {
  const [isAgreedToTerms, setIsAgreedToTerms] = useState<boolean>(false);
  const [isAgreedToPrivacyPolicy, setIsAgreedToPrivacyPolicy] =
    useState<boolean>(false);
  useState<boolean>(false);
  const handleAgreeAll = () => {
    if (isAgreedToTerms && isAgreedToPrivacyPolicy) {
      setIsAgreedToTerms(false);
      setIsAgreedToPrivacyPolicy(false);
    } else {
      setIsAgreedToTerms(true);
      setIsAgreedToPrivacyPolicy(true);
    }
  };
  return (
    <DialogContent className="p-[40px] pt-[64px]">
      <DialogHeader className="mb-[88px] space-y-4">
        <DialogTitle className="text-[36px] font-bold leading-[48px]">
          약관을 확인하고
          <br />
          동의해 주세요.
        </DialogTitle>
        <DialogDescription className="font-medium leading-[24px] text-gray-80">
          더 안전한 서비스를 만들어 가기 위해
          <br />늘 노력하겠습니다.
        </DialogDescription>
      </DialogHeader>
      <LineButton
        align="left"
        title="전체 동의합니다."
        onClick={handleAgreeAll}
      >
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-[2px] border ${isAgreedToTerms && isAgreedToPrivacyPolicy ? "border-transparent bg-green-50 hover:bg-green-70" : "border-gray-30 hover:border-gray-50"} `}
        >
          {isAgreedToTerms && isAgreedToPrivacyPolicy && (
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeWidth="3" d="M4 12l5 5L20 6"></path>
            </svg>
          )}
        </div>
      </LineButton>
      <div className="mt-[24px] space-y-[24px]">
        <Checkbox
          label="서비스 이용 약관 동의"
          checked={isAgreedToTerms}
          required={true}
          onChange={() => setIsAgreedToTerms(!isAgreedToTerms)}
        />
        <Checkbox
          label="개인정보 수집 및 이용 동의"
          checked={isAgreedToPrivacyPolicy}
          required={true}
          onChange={() => setIsAgreedToPrivacyPolicy(!isAgreedToPrivacyPolicy)}
        />
      </div>
      <DialogFooter className="mt-[32px]">
        <PrimaryButton
          isDisabled={!isAgreedToTerms && !isAgreedToPrivacyPolicy}
        >
          다음
        </PrimaryButton>
      </DialogFooter>
    </DialogContent>
  );
}
