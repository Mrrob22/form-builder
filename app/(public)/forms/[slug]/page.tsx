export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Client from './client';

export default async function FillFormPage(
    props: { params: Promise<{ slug: string }> }
) {
    const { slug } = await props.params;
    await dbConnect();

    const form = await FormModel.findOne({ slug, isPublished: true }).lean();
    if (!form) {
        return <div style={{ padding: 24 }}>Форму не знайдено або не опубліковано</div>;
    }

    const plain = JSON.parse(JSON.stringify(form));
    return <Client form={plain} />;
}
