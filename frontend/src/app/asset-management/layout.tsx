import Tabs from "@/widgets/tab/Tabs";
import { Suspense } from "react";
import { Summary } from "@/widgets"; // 새로 분리한 Tab 컴포넌트 가져오기

const AssetManagement: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navItems = [
    { href: "/asset-management/sheet", label: "시트" },
    { href: "/asset-management/overview", label: "요약" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 bg-gray-5 except-mobile:px-5">
      <Tabs items={navItems} />
      {/* timestamp */}
      <Suspense fallback={<div>로딩중...</div>}>
        <Summary />
      </Suspense>
      <div>{children}</div>
    </div>
  );
};

export default AssetManagement;
