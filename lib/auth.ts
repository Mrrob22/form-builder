import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const COOKIE_NAME = 'fb_token';
const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signJwt(
    payload: JWTPayload,
    expiresIn: string | number = '1d'
): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret);
}

export async function verifyJwt<T = any>(token?: string): Promise<T | null> {
    try {
        if (!token) return null;
        const { payload } = await jwtVerify(token, secret);
        return payload as T;
    } catch {
        return null;
    }
}

export async function setAuthCookie(token: string) {
    const store = await cookies();
    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });
}

export async function clearAuthCookie() {
    const store = await cookies();
    store.delete(COOKIE_NAME);
}

export async function getAuth() {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    return await verifyJwt<{ uid: string; role: 'admin' | 'user' }>(token);
}
