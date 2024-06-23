import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { AuthError, type DefaultSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '~/env';
import { db } from '~/server/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
    isLoggedIn: boolean;
    provider: string;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (Date.parse(session.expires) < Date.now()) {
        throw new AuthError('Session expired');
      }
      if (!session.user.email) {
        throw new AuthError('user email not fond');
      }

      return {
        ...session,
        user: {
          ...session.user,
        },
        provider: 'google', //現在Googleだけ今後追加する
        isLoggedIn: true,
      };
    },
  },
});
