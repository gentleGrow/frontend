"use client";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/entities";
import { loginModalAtom } from "@/features";
import { useSetAtom } from "jotai";
import Link from "next/link";
import React from "react";
export default function DropdownMenus() {
  const { user, logout } = useUser();
  const setIsOpenLoginModal = useSetAtom(loginModalAtom);
  return (
    <>
      <DropdownMenuLabel
        className={`${user?.isJoined ? "flex" : "hidden"} shrink-0 items-center justify-between space-x-3 px-4 py-3`}
      >
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10.25"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
            <circle
              cx="11.9999"
              cy="7.33805"
              r="2.22917"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
            <path
              d="M8.46509 12.6383C8.47633 12.6137 8.49575 12.5937 8.52003 12.5819C10.7157 11.5077 13.2843 11.5077 15.4799 12.5819C15.5042 12.5937 15.5236 12.6137 15.5349 12.6383L17.4841 16.9023C17.5598 17.0678 17.4388 17.2562 17.2568 17.2562H6.7432C6.56115 17.2562 6.44014 17.0678 6.51583 16.9023L8.46509 12.6383Z"
              stroke="#5D646E"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-body-2">{user?.email}</p>
          <p className="text-body-3">{user?.nickname}</p>
        </div>
      </DropdownMenuLabel>

      {user?.isJoined ? (
        <>
          <DropdownMenuItem className="px-4 py-[9.5px] text-body-3">
            <Link href="/my-page">마이페이지</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem className="px-4 py-[9.5px] text-body-3">
            고객센터
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            onClick={() => logout()}
            className="px-4 py-[9.5px] text-body-3"
          >
            로그아웃
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuSeparator
            hidden={user?.isJoined ? false : true}
            className="my-2"
          />
          <DropdownMenuItem
            className="px-4 py-[9.5px] text-body-3"
            onClick={() => {
              setIsOpenLoginModal(true);
            }}
          >
            로그인
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
