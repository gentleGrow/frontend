"use client";
import { LineButton, PrimaryButton } from "@/shared";
import { useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/shared/ui/checkbox/index";

export default function UserAgreement({
  nextStep,
  handleClose,
}: {
  handleClose: () => void;
  nextStep: () => void;
}) {
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
    <DialogContent className="w-full flex-col items-center justify-center p-[40px] pt-[64px] tablet:h-[100svh] tablet:max-w-full tablet:rounded-none tablet:pt-[140px] mobile-545:justify-normal">
      <DialogClose
        onClick={handleClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-40 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.1943 10.4171C23.6393 9.97216 23.6393 9.2507 23.1943 8.80571C22.7493 8.36073 22.0278 8.36073 21.5829 8.80571L16 14.3886L10.4171 8.80572C9.97216 8.36073 9.2507 8.36073 8.80571 8.80571C8.36073 9.2507 8.36073 9.97216 8.80571 10.4171L14.3886 16L8.80571 21.5829C8.36073 22.0278 8.36073 22.7493 8.80571 23.1943C9.2507 23.6393 9.97216 23.6393 10.4171 23.1943L16 17.6114L21.5829 23.1943C22.0278 23.6393 22.7493 23.6393 23.1943 23.1943C23.6393 22.7493 23.6393 22.0278 23.1943 21.5829L17.6114 16L23.1943 10.4171Z"
            fill="#4F555E"
          />
        </svg>
        <span className="sr-only">Close</span>
      </DialogClose>
      <div className="flex h-full w-full flex-col justify-between tablet:max-w-[402px] mobile-545:max-w-full">
        <DialogHeader className="mb-[88px] space-y-4 text-left">
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
        <div className="min-w-[405px] mobile-545:min-w-full mobile-545:max-w-full">
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
              onChange={() =>
                setIsAgreedToPrivacyPolicy(!isAgreedToPrivacyPolicy)
              }
            />
          </div>
          <DialogFooter className="mt-[32px] justify-center sm:justify-center">
            <PrimaryButton
              isDisabled={!isAgreedToTerms || !isAgreedToPrivacyPolicy}
              onClick={nextStep}
            >
              다음
            </PrimaryButton>
          </DialogFooter>
        </div>
      </div>
    </DialogContent>
  );
}
