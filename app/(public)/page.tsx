import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Link from 'next/link';

export default async function PublicIndex() {
    await dbConnect();
    const forms = await FormModel.find({ isPublished: true }).lean();
    return (
        <main style={{ padding: 24 }}>
            <h1>Доступні форми</h1>
            <ul>
                {forms.map((f: any) => (
                    <li key={String(f._id)}>
                        <Link href={`/forms/${f.slug}`}>{f.title}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
