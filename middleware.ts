import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';


const COOKIE_NAME = 'fb_token';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);


export async function middleware(req: NextRequest) {
    if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.redirect(new URL('/', req.url));
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'admin') throw new Error('forbidden');
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/', req.url));
    }
}


export const config = { matcher: ['/admin/:path*'] };