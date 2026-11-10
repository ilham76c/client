import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      emailVerified?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    emailVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      emailVerified?: boolean;
    };
  }
}
