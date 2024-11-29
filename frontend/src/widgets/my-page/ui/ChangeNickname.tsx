"use client";
import { User } from "@/entities";
import useUserUpdate from "@/entities/user/model/useUserUpdate";
import { Input, PrimaryButton } from "@/shared";
import { useState } from "react";

export default function ChangeNickname({ user }: { user: User }) {
  const [nickname, setNickname] = useState(user?.nickname);
  const { updateNickname, updateNicknameStatus } = useUserUpdate();
  return (
    <article>
      <label className="text-heading-2 text-gray-100" htmlFor="nickname">
        닉네임
      </label>
      <p className="mb-5 mt-2 font-medium leading-6 text-gray-80 mobile-545:w-[211px]">
        사용하실 닉네임을 입력해 주세요. 닉네임은 언제든 바꿀 수 있어요!
      </p>
      <div className="relative mb-6">
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
      <div className="justify-self-center">
        <PrimaryButton
          buttonSize="medium"
          disabled={
            !nickname ||
            nickname === user.nickname ||
            updateNicknameStatus === "pending"
          }
          onClick={() => {
            updateNickname({ newNickname: nickname });
          }}
        >
          {updateNicknameStatus === "pending" ? "저장 중.." : "저장"}
        </PrimaryButton>
      </div>
    </article>
  );
}
