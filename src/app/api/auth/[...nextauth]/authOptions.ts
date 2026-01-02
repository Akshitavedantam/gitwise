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
      authorization: {
        params: { scope: "r_liteprofile r_emailaddress" },
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

        // CORRECTED: Return a complete user object that matches the User type
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
      // --- NECESSARY MODIFICATION: START ---
      // Check if this is the user's first sign-in.
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { hasOnboarded: true },
      });

      // If they haven't onboarded yet, update their status.
      if (dbUser && dbUser.hasOnboarded === false) {
        await prisma.user.update({
          where: { id: user.id },
          data: { hasOnboarded: true },
        });
        // Update the user object in memory for the next callbacks (jwt, session)
        user.hasOnboarded = true;
      }
      // --- NECESSARY MODIFICATION: END ---

      // --- ORIGINAL CODE: KEPT AS IS ---
      if (!user.username) {
        let baseUsername = "";

        if (profile?.name) {
          baseUsername = profile.name.replace(/\s+/g, "").toLowerCase();
        } else if (profile?.email) {
          baseUsername = profile.email.split("@")[0].toLowerCase();
        } else {
          baseUsername = `user${Math.floor(Math.random() * 10000)}`;
        }

        let username = baseUsername;
        let count = 0;

        while (await prisma.user.findUnique({ where: { username } })) {
          count++;
          username = `${baseUsername}${count}`;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { username },
        });

        user.username = username;
      }
      // --- ORIGINAL CODE: END ---

      return true;
    },

    // UPDATED: Pass all custom properties to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.hasOnboarded = user.hasOnboarded;
      }
      return token;
    },

    // UPDATED: Pass all custom properties from the token to the session
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