import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

type RegisterBody = {
    email?: string;
    password?: string;
    name?: string;
};

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as RegisterBody;

        const email = (body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const name = (body.name || '').trim();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ ok: false, error: 'INVALID_EMAIL' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ ok: false, error: 'WEAK_PASSWORD_MIN_8' }, { status: 400 });
        }

        await dbConnect();

        const exists = await User.findOne({ email }).lean();
        if (exists) {
            return NextResponse.json({ ok: false, error: 'EMAIL_TAKEN' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const role: 'admin' | 'editor' | 'user' =
            email === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'user';

        await User.create({ email, name, role, passwordHash });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('register error:', err);
        return NextResponse.json({ ok: false, error: 'UNEXPECTED_ERROR' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
}
