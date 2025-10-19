'use client';

import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import DynamicForm from '@/components/public/DynamicForm';
import ConfirmDialog from '@/components/public/ConfirmDialog';

export default function Client({ form }: any) {
    const [values, setValues] = React.useState<Record<string, any>>({});
    const [open, setOpen] = React.useState(false);

    const onChange = (name: string, value: any) =>
        setValues((v) => ({ ...v, [name]: value }));

    const submit = () => setOpen(true);

    const confirm = async () => {
        await fetch('/api/graphql', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: `mutation($formId:ID!,$payload:JSON!){
          createSubmission(formId:$formId,payload:$payload){ _id }
        }`,
                variables: { formId: form._id, payload: values },
            }),
        });
        setOpen(false);
        alert('Надіслано!');
    };

    return (
        <Box p={3} display="grid" gap={2}>
            <Typography variant="h5">{form.title}</Typography>

            <DynamicForm fields={form.fields} values={values} onChangeAction={onChange} />

            <Box>
                <Button variant="contained" onClick={submit}>Надіслати</Button>
            </Box>

            <ConfirmDialog
                open={open}
                data={values}
                onCancelAction={() => setOpen(false)}
                onConfirmAction={confirm}
            />
        </Box>
    );
}
