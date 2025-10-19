import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { SignJWT } from 'jose';

const COOKIE = 'fb_token';
const APP_JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function signAppJwt(payload: any, expiresIn = '1d') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(APP_JWT_SECRET);
}

export default async function CompleteAuth() {
    const cookieHeader = (await headers()).get('cookie') ?? '';

    const token = await getToken({
        req: { headers: { cookie: cookieHeader } } as any,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) redirect('/login?error=NoNextAuthToken');

    const email = (token.email as string | undefined) ?? '';
    const role =
        email && email.toLowerCase() === String(process.env.ADMIN_EMAIL).toLowerCase()
            ? 'admin'
            : 'user';
    const uid = email || 'oauth-user';

    const appJwt = await signAppJwt({ uid, role }, '1d');
    const jar = await cookies();
    jar.set(COOKIE, appJwt, { httpOnly: true, sameSite: 'lax', path: '/' });

    redirect(role === 'admin' ? '/admin' : '/');
}
