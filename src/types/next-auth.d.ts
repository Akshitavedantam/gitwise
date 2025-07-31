import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    isFirstLogin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isFirstLogin?: boolean;
  }
}
