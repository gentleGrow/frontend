import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets";
import AuthProvider from "./AuthProvider";
import JotaiProvider from "./JotaiProvider";
import { LoginDialog } from "@/features";
import QueryClientProvider from "@/app/QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <JotaiProvider>
          <AuthProvider>
            <QueryClientProvider>
              <div className="relative min-h-svh text-body-1">
                <Header />
                {children}
                <LoginDialog />
              </div>
            </QueryClientProvider>
          </AuthProvider>
        </JotaiProvider>
        <footer className="mx-auto flex h-[84px] max-w-[1400px] items-center justify-between bg-gray-5 px-[20px]">
          <p>Copyrighted © insightout all rights reserved.</p>
          <p>email@gmail.com</p>
        </footer>
      </body>
    </html>
  );
}
