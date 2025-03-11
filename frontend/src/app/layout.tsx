import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Footer, Header, LoginFloatingCTAButton } from "@/widgets";
import AuthProvider from "./AuthProvider";
import JotaiProvider from "./JotaiProvider";
import { LoginDialog } from "@/features";
import QueryClientProvider from "@/app/QueryClientProvider";
import localFont from "next/font/local";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUser } from "@/entities";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ollass.com"),
  title: {
    default: "Ollass - 똑똑한 자산 관리의 시작",
    template: "%s | Ollass",
  },
  description:
    "엑셀 대신 온라인에서 간편하게 관리하는 투자 자산 관리 서비스. 주식, 펀드 등 다양한 자산을 한눈에 보고 관리하세요. 실시간 포트폴리오 분석과 직관적인 차트를 통해 더 나은 투자 결정을 내릴 수 있습니다.",
  keywords: [
    "자산관리",
    "포트폴리오",
    "주식투자",
    "투자관리",
    "자산포트폴리오",
    "주식관리",
    "온라인자산관리",
    "투자분석",
    "자산현황",
    "투자현황",
    "주식차트",
    "자산차트",
  ],
  authors: [{ name: "Ollass" }],
  creator: "Ollass",
  publisher: "Ollass",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    title: "Ollass",
  },
  openGraph: {
    title: "Ollass - 똑똑한 자산 관리의 시작",
    description:
      "엑셀보다 쉽고 편리한 온라인 자산 관리 서비스. 실시간 포트폴리오 분석과 직관적인 차트로 투자 현황을 한눈에 파악하세요.",
    url: "/",
    siteName: "Ollass",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ollass - 자산 관리 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ollass - 똑똑한 자산 관리의 시작",
    description:
      "엑셀보다 쉽고 편리한 온라인 자산 관리 서비스. 실시간 포트폴리오 분석과 직관적인 차트로 투자 현황을 한눈에 파악하세요.",
    images: ["/og-image.png"],
    creator: "@Ollass",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "자산관리",
  verification: {
    google: "Oa6GtjU0pyHNSVYhnPFvXxWDl8MziOxJhVjDm8B1ZrQ",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="ko">
      <GoogleAnalytics gaId="G-PG7PJNPHLH" />
      <GoogleTagManager gtmId="GTM-KKVNDB8Z" />
      <body className={`${pretendard.className}`}>
        <JotaiProvider>
          <QueryClientProvider>
            <AuthProvider user={user}>
              <TooltipProvider>
                <div className="relative flex min-h-dvh flex-col text-body-1 text-gray-100">
                  <div className="flex flex-1 flex-col">
                    {user !== undefined && <Header />}
                    {children}
                  </div>
                  <Footer />
                  <LoginFloatingCTAButton />
                  <LoginDialog />
                </div>
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </JotaiProvider>
        <div id="drag-overlay" className="absolute left-0 top-0"></div>
      </body>
      <GoogleAnalytics gaId={process.env.GA_ID as string} />
    </html>
  );
}
