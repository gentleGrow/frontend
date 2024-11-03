import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/widgets";
import AuthProvider from "./AuthProvider";
import JotaiProvider from "./JotaiProvider";
import { LoginDialog } from "@/features";
import QueryClientProvider from "@/app/QueryClientProvider";
import localFont from "next/font/local";

import { GoogleAnalytics } from "@next/third-parties/google";

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
                <Footer />
              </div>
            </QueryClientProvider>
          </AuthProvider>
        </JotaiProvider>
        <div id="drag-overlay" className="absolute left-0 top-0"></div>
      </body>
      <GoogleAnalytics gaId={process.env.GA_ID as string} />
    </html>
  );
}
