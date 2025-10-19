import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Client from './client';

export default async function FillFormPage({ params }: { params: { slug: string } }) {
    await dbConnect();
    const form = await FormModel.findOne({ slug: params.slug, isPublished: true }).lean();
    if (!form) return <div style={{ padding: 24 }}>Форму не знайдено</div>;
    return <Client form={JSON.parse(JSON.stringify(form))} />;
}
