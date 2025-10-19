import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Link from 'next/link';

export default async function AdminForms() {
    await dbConnect();
    const forms = await FormModel.find().lean();
    return (
        <main style={{ padding: 24 }}>
            <h1>Форми</h1>
            <p><Link href="/admin/forms/new">+ Нова форма</Link></p>
            <ul>
                {forms.map((f: any) => (
                    <li key={String(f._id)}>
                        <Link href={`/admin/forms/${f._id}/edit`}>{f.title}</Link> • {f.isPublished ? 'Опубліковано' : 'Чернетка'}
                    </li>
                ))}
            </ul>
        </main>
    );
}
