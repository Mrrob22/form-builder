import { dbConnect } from '@/lib/db';
import FormModel from '@/models/Form';
import Client from './client';

export default async function EditFormPage({ params }: { params: { id: string } }) {
    await dbConnect();
    const form = await FormModel.findById(params.id).lean();
    if (!form) return <div style={{ padding: 24 }}>Not found</div>;
    return <Client form={JSON.parse(JSON.stringify(form))} />;
}
