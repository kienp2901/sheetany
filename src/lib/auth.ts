import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { apiClient } from './api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      void profile;
      if (account?.provider === 'google') {
        // Check if email is from @hocmai.vn domain
        // if (!profile?.email?.endsWith('@hocmai.vn')) {
        //   return true;
        // }
        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === 'google' && account.access_token) {
        try {
          // Call the login API to get our auth token
          const loginResponse = await apiClient.loginGoogle(account.access_token);
          token.accessToken = loginResponse.token;
        } catch (error) {
          console.error('Failed to authenticate with HOCMAI API:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
