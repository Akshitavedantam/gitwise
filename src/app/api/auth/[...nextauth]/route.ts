import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // 👈 make sure path is correct

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
