import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    isPremium?: boolean;
  }

  interface Session {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isPremium: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isPremium?: boolean;
  }
}
