import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import {prisma} from "@/lib/prisma";

export const {handlers, signIn, signOut, auth} = NextAuth({
  adapter: PrismaAdapter(prisma),

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {email: credentials.email as string}
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],

  pages: {
    signIn: "/login"
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
    }
  },

  secret: process.env.AUTH_SECRET
});