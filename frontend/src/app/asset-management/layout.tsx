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
    <div className="mx-auto w-full max-w-[1400px] flex-1 bg-gray-5 py-[20px]">
      <div className="header px-[20px]">
        <Tabs items={navItems} />
        {/* timestamp */}
        <Suspense fallback={<div>로딩중...</div>}>
          <Summary />
        </Suspense>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AssetManagement;
