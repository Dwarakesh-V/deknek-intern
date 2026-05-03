import bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismaDb';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'credentials',

      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('email');
        }

        if (!user.hashedPassword) {
          throw new Error('password_not_set');
        }

        if (!user.emailVerified) {
          throw new Error('not_confirmed');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isPasswordCorrect) {
          throw new Error('password');
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (session.user && user) {
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.image = user.image;
        }
      }

      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
