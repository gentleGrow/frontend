"use client"; // Client Component로 선언

import Tabs from "@/widgets/tab/Tabs";
import Summary from "@/widgets/card/Summary";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary"; // 새로 분리한 Tab 컴포넌트 가져오기

const AssetManagement: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navItems = [
    { href: "/asset-management/sheet", label: "시트" },
    { href: "/asset-management/overview", label: "요약" },
  ];

  return (
    <div className="h-full py-[20px]">
      <div className="header px-[20px]">
        <Tabs items={navItems} />
        {/* timestamp */}
        <ErrorBoundary
          errorComponent={({ error }) => (
            <div>에러가 발생 했습니다.{error.message}</div>
          )}
        >
          <Suspense fallback={<div>로딩중...</div>}>
            <Summary />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="content h-[calc(100svh-64px)] min-w-[1080px] overflow-auto bg-gray-5 px-[20px] pt-[20px]">
        {children}
      </div>
    </div>
  );
};

export default AssetManagement;
