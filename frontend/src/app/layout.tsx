import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/widgets";
import AuthProvider from "./AuthProvider";
import JotaiProvider from "./JotaiProvider";
import { LoginDialog } from "@/features";
import QueryClientProvider from "@/app/QueryClientProvider";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gentle Grow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className}`}>
        <JotaiProvider>
          <AuthProvider>
            <QueryClientProvider>
              <div className="relative flex min-h-dvh flex-col text-body-1 text-gray-100">
                <div className="flex flex-1 flex-col">
                  <Header />
                  {children}
                </div>
                <LoginDialog />
                <footer className="mx-auto flex h-[84px] w-full max-w-[1400px] items-center justify-between bg-gray-5 px-[20px]">
                  <p>Copyrighted © insightout all rights reserved.</p>
                  <p>email@gmail.com</p>
                </footer>
              </div>
            </QueryClientProvider>
          </AuthProvider>
        </JotaiProvider>
        <div id="drag-overlay" className="absolute left-0 top-0"></div>
      </body>
    </html>
  );
}
