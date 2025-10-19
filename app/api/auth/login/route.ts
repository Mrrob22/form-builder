import { NextResponse } from 'next/server';
import { signJwt, setAuthCookie } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { Types } from 'mongoose';

type UserLean = {
    _id: Types.ObjectId;
    email: string;
    name?: string;
    role?: 'admin' | 'editor' | 'user' | string;
};

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        await dbConnect();

        const user = await User.findOne({ email }).lean<UserLean | null>();
        const passOk = password === process.env.ADMIN_PASSWORD;

        if (!user || !passOk) {
            return NextResponse.json(
                { ok: false, error: 'INVALID_CREDENTIALS' },
                { status: 401 }
            );
        }

        const token = await signJwt(
            { uid: String(user._id), role: (user.role as 'admin' | 'editor' | 'user') ?? 'user' },
            '1d'
        );

        await setAuthCookie(token);

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: 'UNEXPECTED_ERROR' },
            { status: 500 }
        );
    }
}
