import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { hashPassword, needsPasswordRehash, verifyPassword } from '@/lib/password';
import { loginSchema } from '@/lib/validation';

const { users } = schema;

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'development-only-auth-secret';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: getAuthSecret(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const db = getDb();
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
          return null;
        }

        if (needsPasswordRehash(user.passwordHash)) {
          await db.update(users)
            .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
            .where(eq(users.id, user.id));
        }

        const isPremium = Boolean(
          user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date())
        );

        return {
          id: user.id,
          email: user.email,
          isPremium,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isPremium = Boolean(user.isPremium);
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isPremium = Boolean(token.isPremium);
      }

      return session;
    },
  },
});
