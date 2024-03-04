import '../../styles/global.scss';
import Provider from '@/components/provider/Provider';
import Header from '@/components/header/Header';
export const metadata = {
  title: '젠틀그로우',
  description:
    '젠틀그로우는 투자 현황을 기록하고 분석해 더 나은 투자를 만들어 갑니다. 간편 로그인으로 쉽고 빠르게 서비스를 시작하세요.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
