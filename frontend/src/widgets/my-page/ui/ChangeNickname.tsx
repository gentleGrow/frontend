"use client";
import { User } from "@/entities";
import { Input, PrimaryButton } from "@/shared";
import updateNickname from "@/widgets/join-dialog/api/updateNickname";
import { useState } from "react";

export default function ChangeNickname({ user }: { user: User }) {
  const [nickname, setNickname] = useState(user?.nickname);
  return (
    <>
      <label className="text-heading-2 text-gray-100" htmlFor="nickname">
        닉네임
      </label>
      <p className="mb-8 mt-3 font-medium leading-6 text-gray-80 mobile-545:w-[211px]">
        사용하실 닉네임을 입력해 주세요. 닉네임은 언제든 바꿀 수 있어요!
      </p>
      <div className="relative mb-11">
        <Input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-5 text-gray-60">
          {nickname.length}/12
        </span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <PrimaryButton
          buttonSize="medium"
          disabled={!nickname || nickname === user.nickname}
          onClick={async () => {
            await updateNickname(nickname);
          }}
        >
          저장
        </PrimaryButton>
      </div>
    </>
  );
}
