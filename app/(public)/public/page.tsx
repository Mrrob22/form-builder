export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Link from 'next/link';

export default async function PublicIndex() {
    await dbConnect();
    const forms = await FormModel.find({ isPublished: true }).lean();
    const plain = JSON.parse(JSON.stringify(forms));
    return (
        <main style={{ padding: 24 }}>
            <h1>Доступні форми</h1>
            <ul>
                {plain.map((f: any) => (
                    <li key={f._id}>
                        <Link href={`/forms/${f.slug}`}>{f.title}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
