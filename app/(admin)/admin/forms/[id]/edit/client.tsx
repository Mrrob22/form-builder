'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import EditorCanvas from '@/components/admin/FormEditor/EditorCanvas';
import Sidebar from '@/components/admin/FormEditor/Sidebar';
import Toolbar from '@/components/admin/FormEditor/Toolbar';
import { v4 as uuid } from 'uuid';

export default function Client({ form }: any) {
    const [fields, setFields] = useState<any[]>(form.fields ?? []);
    const [selected, setSelected] = useState<string | undefined>();

    const upsert = (patch: any) =>
        setFields((prev) => prev.map((f) => (f.id === patch.id ? patch : f)));

    const add = (type: 'text' | 'number' | 'textarea') =>
        setFields((prev) => [
            ...prev,
            { id: uuid(), type, name: `${type}_${prev.length + 1}`, label: type, required: false },
        ]);

    const save = async () => {
        await fetch('/api/graphql', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: `mutation($id:ID!,$input:FormInput!){
          updateForm(id:$id,input:$input){ _id }
        }`,
                variables: {
                    id: form._id,
                    input: {
                        title: form.title,
                        slug: form.slug,
                        description: form.description,
                        fields,
                        isPublished: form.isPublished,
                    },
                },
            }),
        });
        alert('Збережено');
    };

    const publish = async () => {
        await fetch('/api/graphql', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: `mutation($id:ID!){
          publishForm(id:$id,value:true){ _id }
        }`,
                variables: { id: form._id },
            }),
        });
        alert('Опубліковано');
    };

    return (
        <Box display="grid" gridTemplateColumns="1fr 320px" gap={2} p={3}>
            <Box display="grid" gap={2}>
                <Toolbar
                    onAddTextAction={() => add('text')}
                    onAddNumberAction={() => add('number')}
                    onAddTextareaAction={() => add('textarea')}
                    onSaveAction={save}
                    onPublishAction={publish}
                />
                <EditorCanvas fields={fields} selectedId={selected} onSelectAction={setSelected} />
            </Box>
            <Sidebar value={fields.find((f) => f.id === selected)} onChangeAction={upsert} />
        </Box>
    );
}
