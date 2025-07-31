import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.isFirstLogin = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.isFirstLogin === "boolean") {
        session.isFirstLogin = token.isFirstLogin;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (
        url === "/api/auth/callback/github" ||
        url === "/api/auth/callback/google"
      ) {
        return `${baseUrl}/redirecting`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
