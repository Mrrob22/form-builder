import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, profile }) {
            const email = (profile as any)?.email || token.email;
            token.role = email && email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
            return token;
        },
        async session({ session, token }) {
            (session as any).role = (token as any).role || 'user';
            return session;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}`;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
