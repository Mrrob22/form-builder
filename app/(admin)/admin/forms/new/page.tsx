import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import { redirect } from 'next/navigation';

export default async function NewFormPage() {
    await dbConnect();
    const f = await FormModel.create({
        title: 'Нова форма',
        slug: `form-${Date.now()}`,
        fields: [],
        isPublished: false,
    });
    redirect(`/admin/forms/${f._id}/edit`);
}
