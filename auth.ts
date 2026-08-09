import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import {prisma} from "@/lib/prisma";

export const {handlers, signIn, signOut, auth} = NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt"
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "E-poštni naslov",
          type: "email"
        },
        password: {
          label: "Geslo",
          type: "password"
        }
      },

      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {email}
        });

        if (!user) {
          console.log("Admin login failed: user not found", email);
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          console.log("Admin login failed: password mismatch", email);
          return null;
        }

        console.log("Admin login successful", email);

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],

  pages: {
    signIn: "/sl/login"
  },

  callbacks: {
    async jwt({token, user}) {
      if (user?.email) {
        const databaseUser = await prisma.user.findUnique({
          where: {email: user.email},
          select: {role: true}
        });

      token.role = databaseUser?.role ?? "CUSTOMER";
      }

      return token;
    },

    async session({session, token}) {
      if (session.user) {
        (session.user as typeof session.user & {role?: string}).role =
          (token.role as string) ?? "CUSTOMER";
      }

      return session;
    }
  },

  secret: process.env.AUTH_SECRET
});
