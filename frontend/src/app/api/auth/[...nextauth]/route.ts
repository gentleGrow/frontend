import NextAuth from 'next-auth/next';
import NaverProvider from 'next-auth/providers/naver';
import KaKaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string
    }),
    KaKaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.id;
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
