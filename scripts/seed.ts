import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

async function main() {
    console.log('[ENV] MONGODB_URI =', process.env.MONGODB_URI);
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (!adminEmail) throw new Error('ADMIN_EMAIL is required in .env.local');

    await dbConnect();

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const res = await User.updateOne(
        { email: adminEmail },
        {
            $setOnInsert: {
                email: adminEmail,
                name: 'Admin',
                passwordHash,
            },
            $set: {
                role: 'admin',
            },
        },
        { upsert: true }
    );

    console.log('Seed done:', {
        email: adminEmail,
        upserted: res.upsertedCount > 0,
        matchedCount: res.matchedCount,
        modifiedCount: res.modifiedCount,
    });

    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
