import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize() {
        return {
          id: '1',
          email: 'test@test.com',
          name: 'Test',
          role: 'user',
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};