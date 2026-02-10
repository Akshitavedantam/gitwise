import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No account found with that email.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
          hasOnboarded: user.hasOnboarded,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/register",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.id) return false;

      // Handle Username Generation for new Social Users
      if (!user.username) {
        let baseUsername = "";

        if (user.name) {
          baseUsername = user.name.replace(/\s+/g, "").toLowerCase();
        } else if (user.email) {
          baseUsername = user.email.split("@")[0].toLowerCase();
        } else {
          baseUsername = `user${Math.floor(Math.random() * 10000)}`;
        }

        let finalUsername = baseUsername;
        let count = 0;

        // Ensure username uniqueness
        while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
          count++;
          finalUsername = `${baseUsername}${count}`;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { username: finalUsername },
        });

        user.username = finalUsername;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.hasOnboarded = user.hasOnboarded;
      }
      
      // Allow manual session updates (useful for onboarding)
      if (trigger === "update" && session?.hasOnboarded !== undefined) {
        token.hasOnboarded = session.hasOnboarded;
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.hasOnboarded = token.hasOnboarded as boolean;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};