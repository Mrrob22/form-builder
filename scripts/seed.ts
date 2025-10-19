import { dbConnect } from '@/lib/db';
import User from '@/models/User';

(async () => {
    await dbConnect();
    const email = process.env.ADMIN_EMAIL!;
    const exists = await User.findOne({ email });
    if (!exists) {
        await User.create({ email, name: 'Seed Admin', role: 'admin' });
        console.log('Admin seeded:', email);
    } else {
        console.log('Admin exists:', email);
    }
    process.exit(0);
})();
