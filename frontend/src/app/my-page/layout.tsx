import { MyPageMenu } from "@/widgets";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] space-x-[131px] pt-10">
      <MyPageMenu />
      {children}
    </div>
  );
}
