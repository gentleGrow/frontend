import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header, LoginFloatingCTAButton } from "@/widgets";
import AuthProvider from "../entities/user/hooks/AuthProvider";
import JotaiProvider from "./JotaiProvider";
import { LoginDialog } from "@/features";
import QueryClientProvider from "@/app/QueryClientProvider";
import localFont from "next/font/local";

import { GoogleAnalytics } from "@next/third-parties/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import Head from "next/head";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Head>
        <meta name="apple-mobile-web-app-title" content="Ollass" />
      </Head>
      <body className={`${pretendard.className}`}>
        <JotaiProvider>
          <QueryClientProvider>
            <AuthProvider>
              <TooltipProvider>
                <div className="relative flex min-h-dvh flex-col text-body-1 text-gray-100">
                  <div className="flex flex-1 flex-col">
                    <Header />
                    {children}
                  </div>
                  <LoginFloatingCTAButton />
                  <LoginDialog />
                  <Footer />
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
