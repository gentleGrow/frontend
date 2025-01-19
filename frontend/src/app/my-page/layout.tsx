import { MyPageMenu } from "@/widgets";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] justify-between px-4 pt-10 mobile-545:flex-col mobile-545:space-y-6">
      <div className="w-3/12 mobile-545:w-full">
        <MyPageMenu />
      </div>
      <div className="w-8/12 mobile-545:w-full">{children}</div>
    </div>
  );
}
