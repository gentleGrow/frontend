import { Input, PrimaryButton } from "@/shared";
import { useState, useCallback } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import hasSpecialChar from "../utils/hasSpecialChar";
import updateNickname from "../api/updateNickname";
import debounce from "lodash.debounce";
import checkValidateNickname from "../api/checkValidateNickname";

export default function NicknameSetup({
  initializeUser,
}: {
  initializeUser: () => void;
}) {
  const [nickname, setNickname] = useState<string>("");
  const [isUsed, setIsUsed] = useState<boolean>(false);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);

  const isNicknameInvalid =
    isUsed ||
    hasSpecialChar(nickname) ||
    nickname.length < 2 ||
    nickname.length > 12;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckNickname = useCallback(
    debounce(async (newNickname: string) => {
      const isValid = await checkValidateNickname(newNickname);
      setIsUsed(!isValid);
    }, 300),
    [],
  );

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    debouncedCheckNickname(newNickname);
  };

  return (
    <DialogContent className="p-[40px] pt-[64px]">
      <DialogHeader className="mb-[140px] space-y-4">
        <DialogTitle className="text-[36px] font-bold leading-[48px]">
          닉네임을
          <br />
          입력해 주세요.
        </DialogTitle>
        <DialogDescription className="font-medium leading-[24px] text-gray-80">
          사용하실 닉네임을 입력해 주세요.
          <br />
          닉네임은 언제든 바꿀 수 있어요!
        </DialogDescription>
      </DialogHeader>

      <div className="relative space-y-2">
        <Input
          type="text"
          placeholder="닉네임을 입력해 주세요."
          value={nickname}
          isError={nickname !== "" && isNicknameInvalid}
          onBlur={() => setIsOnFocus(false)}
          onFocus={() => setIsOnFocus(true)}
          onChange={handleNicknameChange}
        />

        <div className="text-body-5 text-gray-100">
          {nickname.length === 0 ? (
            "2~12자 내 한글, 영문 대소문자, 숫자만 입력할 수 있어요."
          ) : isNicknameInvalid ? (
            <div className="flex items-center space-x-1 text-alert">
              <svg
                className="flex-shrink-0"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="5.5" fill="white" stroke="#F84A4A" />
                <rect
                  x="7.375"
                  y="4.38672"
                  width="1.25"
                  height="5"
                  fill="#F84A4A"
                />
                <rect
                  x="7.375"
                  y="10.3633"
                  width="1.25"
                  height="1.25"
                  fill="#F84A4A"
                />
              </svg>
              <span>
                {isUsed && "이미 사용 중인 닉네임이에요."}
                {hasSpecialChar(nickname) && "특수문자는 사용할 수 없어요."}
                {(nickname.length < 2 || nickname.length > 12) &&
                  "2~12자 내로 입력해 주세요."}
              </span>
            </div>
          ) : !isOnFocus ? (
            <div className="flex items-center space-x-1 text-green-60">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="5.5" fill="white" stroke="#05D665" />
                <path
                  d="M5 8.51613L6.93548 10.2581L11 6"
                  stroke="#05D665"
                  strokeWidth="1.25"
                />
              </svg>
              <span>정말 멋진 닉네임이에요!</span>
            </div>
          ) : null}
        </div>

        <span
          className={`absolute right-[10px] top-[3px] text-body-5 text-gray-60 ${
            isOnFocus ? "block" : "hidden"
          }`}
        >
          {nickname.length}/12
        </span>
      </div>

      <DialogFooter className="mt-[52px]">
        <PrimaryButton
          isDisabled={isNicknameInvalid || nickname.length < 2}
          onClick={async () =>
            await updateNickname(nickname).then(initializeUser)
          }
        >
          완료하기
        </PrimaryButton>
      </DialogFooter>
    </DialogContent>
  );
}
