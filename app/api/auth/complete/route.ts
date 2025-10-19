export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
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

export async function GET(req: Request) {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/login?error=NoNextAuthToken', req.url));
    }

    const email = (token.email as string | undefined) ?? '';
    const role =
        email && email.toLowerCase() === String(process.env.ADMIN_EMAIL).toLowerCase()
            ? 'admin'
            : 'user';
    const uid = email || 'oauth-user';

    const appJwt = await signAppJwt({ uid, role }, '1d');

    const res = NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/', req.url));
    res.cookies.set(COOKIE, appJwt, { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
}
