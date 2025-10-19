import { NextResponse } from 'next/server';
import { signJwt, setAuthCookie } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        await dbConnect();

        const user = await User.findOne({ email: String(email || '').toLowerCase() })
            .lean<{ _id: any; email: string; role?: string; passwordHash?: string } | null>();

        let passOk = false;

        if (user?.passwordHash) {
            passOk = await bcrypt.compare(String(password || ''), user.passwordHash);
        } else if (email === process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
            passOk = String(password || '') === process.env.ADMIN_PASSWORD;
        }

        if (!user || !passOk) {
            return NextResponse.json({ ok: false, error: 'INVALID_CREDENTIALS' }, { status: 401 });
        }

        const role =
            (user.role as any) ||
            (String(email).toLowerCase() === String(process.env.ADMIN_EMAIL).toLowerCase()
                ? 'admin'
                : 'user');

        const token = await signJwt({ uid: String(user._id), role }, '1d');
        await setAuthCookie(token);

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false, error: 'UNEXPECTED_ERROR' }, { status: 500 });
    }
}
