import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: data.user?.id ?? '',
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
          user: data.user ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Google OAuth: kirim ID Token ke Go Auth Service.
      if (account?.provider === 'google' && account.id_token) {
        const res = await fetch(`${API_URL}/auth/oauth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'google',
            id_token: account.id_token,
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);

          if (res.status === 409) {
            const error = String(errorBody?.error ?? '');

            if (error.includes('not verified')) {
              throw new Error('OAuthAccountNotVerified');
            }

            if (error.includes('already registered')) {
              throw new Error('OAuthAccountAlreadyRegistered');
            }
          }

          console.error('[Google OAuth] Go Auth Service error:', {
            status: res.status,
            body: errorBody,
          });

          throw new Error('Google OAuth authentication failed');
        }

        const data = await res.json();

        token.accessToken = data.access_token;
        token.refreshToken = data.refresh_token;
        token.expiresIn = data.expires_in;
        token.user = data.user ?? null;
      }

      // Credentials login.
      if (user) {
        const data = user as any;

        token.accessToken = data.access_token;
        token.refreshToken = data.refresh_token;
        token.expiresIn = data.expires_in;
        token.user = data.user;
      }

      return token;
    },

    async session({ session, token }) {
      // Jangan mengekspos access token maupun refresh token ke browser.
      session.user = token.user as any;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
