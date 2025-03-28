import { Input, PrimaryButton } from "@/shared";
import { useCallback, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import hasSpecialChar from "../utils/hasSpecialChar";
import updateNickname from "../api/updateNickname";
import checkValidateNickname from "../api/checkValidateNickname";
import { useRouter } from "next/navigation";
import { getUser, useUser } from "@/entities";
import { debounce } from "lodash";

export default function NicknameSetup({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const router = useRouter();
  const { setUser } = useUser();

  const [nickname, setNickname] = useState<string>("");
  const [isUsed, setIsUsed] = useState<boolean>(false);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isNicknameInvalid =
    hasSpecialChar(nickname) || nickname.length < 2 || nickname.length > 12;

  const debouncedCheckNickname = useCallback((newNickname: string) => {
    const checkNickname = debounce(async (nickname: string) => {
      const isUsed = await checkValidateNickname(nickname);
      setIsUsed(isUsed);
    }, 300, {
      trailing: true,
    });
    
    checkNickname(newNickname);
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    debouncedCheckNickname(newNickname);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const isUpdated = await updateNickname(nickname);
      if (!isUpdated) {
        setErrorMessage(
          "회원가입 도중 오류가 발생했어요. 다시 시도해 주세요.",
        );
        return;
      }

      const user = await getUser();
      if (!user) {
        setErrorMessage("사용자 정보를 가져오는데 실패했어요.");
        return;
      }

      setUser(user);
      router.replace("/");
    } catch (error) {
      setErrorMessage("알 수 없는 오류가 발생했어요.");
    } finally {
      setIsSubmitting(false);
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
        <DialogHeader className="mb-[140px] space-y-4 text-left">
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
        <div className="min-w-[405px] mobile-545:min-w-full mobile-545:max-w-full">
          <div className="relative space-y-2">
            <Input
              type="text"
              placeholder="닉네임을 입력해 주세요."
              value={nickname}
              isError={(nickname !== "" && isNicknameInvalid) || isUsed}
              onBlur={() => setIsOnFocus(false)}
              onFocus={() => setIsOnFocus(true)}
              onChange={handleNicknameChange}
              isDisabled={isSubmitting}
            />

            <div className="text-body-5 text-gray-100">
              {nickname.length === 0 ? (
                "2~12자 내 한글, 영문 대소문자, 숫자만 입력할 수 있어요."
              ) : isNicknameInvalid || isUsed ? (
                <div className="flex items-center space-x-1 text-alert">
                  <svg
                    className="flex-shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="5.5"
                      fill="white"
                      stroke="#F84A4A"
                    />
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
                    {!isNicknameInvalid &&
                      isUsed &&
                      "이미 사용 중인 닉네임이에요."}
                    {hasSpecialChar(nickname) && "특수문자는 사용할 수 없어요."}
                    {(nickname.length < 2 || nickname.length > 12) &&
                      "2~12자 내로 입력해 주세요."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-green-60">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="5.5"
                      fill="white"
                      stroke="#05D665"
                    />
                    <path
                      d="M5 8.51613L6.93548 10.2581L11 6"
                      stroke="#05D665"
                      strokeWidth="1.25"
                    />
                  </svg>
                  <span>정말 멋진 닉네임이에요!</span>
                </div>
              )}
            </div>

            <span
              className={`absolute right-[10px] top-[3px] text-body-5 text-gray-60 ${
                isOnFocus ? "block" : "hidden"
              }`}
            >
              {nickname.length}/12
            </span>
          </div>

          <DialogFooter className="mt-[52px] flex flex-col space-y-2 sm:flex-col">
            <p className="text-center text-xs text-alert">{errorMessage}</p>
            <PrimaryButton
              isDisabled={isUsed || isNicknameInvalid || nickname.length < 2 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "처리 중..." : "완료하기"}
            </PrimaryButton>
          </DialogFooter>
        </div>
      </div>
    </DialogContent>
  );
}
