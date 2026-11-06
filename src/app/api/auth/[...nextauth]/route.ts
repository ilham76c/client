import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.API_URL!;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        return await res.json();
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Login pertama menggunakan Google atau GitHub
      if (
        account &&
        (account.provider === 'google' || account.provider === 'github')
      ) {
        const res = await fetch(`${API_URL}/api/v1/auth/oauth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: account.provider,
            id_token: account.id_token,
            access_token: account.access_token,
          }),
        });

        if (!res.ok) {
          throw new Error('OAuth authentication failed');
        }

        const data = await res.json();

        token.accessToken = data.access_token;
        token.user = data.user;
      }

      // Login menggunakan email dan password
      if (user) {
        const data = user as any;

        token.accessToken = data.access_token;
        token.user = data.user ?? {
          id: data.id,
          name: data.name,
          email: data.email,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };