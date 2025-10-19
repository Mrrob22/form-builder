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
    const selectedField = fields.find((f) => f.id === selected);

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

    const onAiAddAction = async () => {
        const p = window.prompt('Опиши поле (напр.: "Додай поле для телефону, обов’язкове")');
        if (!p) return;
        try {
            const res = await fetch('/api/ai/agent', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    prompt: p,
                    mode: 'add',
                    context: { fields },
                }),
            });
            const data = await res.json();
            if (data.field) setFields((prev) => [...prev, data.field]);
            else if (data.fields?.length) setFields((prev) => [...prev, ...data.fields]);
            else alert('AI не повернув поле');
        } catch (e) {
            console.error(e);
            alert('Помилка AI');
        }
    };

    const onAiEditAction = async () => {
        if (!selectedField) return alert('Оберіть поле для редагування');
        const p = window.prompt('Опиши зміну (напр.: "Зроби поле повідомлення обов’язковим і 6 рядків")');
        if (!p) return;
        try {
            const res = await fetch('/api/ai/agent', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    prompt: p,
                    mode: 'edit',
                    field: selectedField,
                    context: { fields },
                }),
            });
            const data = await res.json();
            if (data.field) {
                setFields((prev) => prev.map((f) => (f.id === selectedField.id ? data.field : f)));
            } else {
                alert('AI не повернув змінене поле');
            }
        } catch (e) {
            console.error(e);
            alert('Помилка AI');
        }
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
                    onAiAddAction={onAiAddAction}
                    onAiEditAction={onAiEditAction}
                    aiEditDisabled={!selectedField}
                />
                <EditorCanvas fields={fields} selectedId={selected} onSelectAction={setSelected} />
            </Box>
            <Sidebar value={selectedField} onChangeAction={upsert} />
        </Box>
    );
}
