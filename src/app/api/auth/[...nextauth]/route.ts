import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// NextAuth options
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  useSecureCookies: process.env.NODE_ENV === "production",

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Add this line to link accounts with the same email
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // Add this line to link accounts with the same email
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: { params: { scope: "r_liteprofile r_emailaddress" } },
      // Add this line to link accounts with the same email
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
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

  events: {
    async createUser({ user }) {
      console.log("EVENT: 'createUser' - Fired for user:", user.email);
      try {
        let baseUsername = "";
        if (user.name) {
          baseUsername = user.name.replace(/\s+/g, "").toLowerCase();
        } else if (user.email) {
          baseUsername = user.email.split("@")[0].toLowerCase();
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
        console.log(`EVENT: 'createUser' - Successfully created username '${username}' for user:`, user.id);
      } catch (error) {
        console.error("EVENT: 'createUser' - Error updating user with username:", error);
      }
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      console.log("CALLBACK: 'signIn' - Fired for user:", user.email, "with provider:", account?.provider);
      return true;
    },

    async jwt({ token, user, account }) {
      console.log("CALLBACK: 'jwt' - Fired.");
      if (user) {
        console.log("CALLBACK: 'jwt' - User object is available (sign-in flow). Fetching full user from DB.");
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (dbUser) {
            console.log("CALLBACK: 'jwt' - Found user in DB:", { id: dbUser.id, username: dbUser.username, hasOnboarded: dbUser.hasOnboarded });
            token.id = user.id;
            token.username = dbUser.username;
            token.hasOnboarded = dbUser.hasOnboarded;
          } else {
            console.log("CALLBACK: 'jwt' - WARNING: User object was present, but user not found in DB with id:", user.id);
          }
        } catch (error) {
          console.error("CALLBACK: 'jwt' - Error fetching user from DB:", error);
          return token;
        }
      }
      console.log("CALLBACK: 'jwt' - Returning token.");
      return token;
    },

    async session({ session, token }) {
      console.log("CALLBACK: 'session' - Fired. Populating session from token.");
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.hasOnboarded = token.hasOnboarded;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      console.log("CALLBACK: 'redirect' - Fired. Sign-in was successful. Redirecting to post-login page.");
      return `${baseUrl}/post-login`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

