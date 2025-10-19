import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';


const handler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (profile?.email && profile.email === process.env.ADMIN_EMAIL) {
                token.role = 'admin';
            } else {
                token.role = 'user';
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).role = token.role;
            return session;
        }
    }
});


export { handler as GET, handler as POST };