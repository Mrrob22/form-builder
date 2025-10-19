'use client';
import * as React from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';

export default function Sidebar({
                                    value,
                                    onChangeAction,
                                }: {
    value?: any;
    onChangeAction: (f: any) => void;
}) {
    if (!value) {
        return (
            <Box p={2}>
                <Typography color="text.secondary">Выберите поле</Typography>
            </Box>
        );
    }

    const patch = (k: string, v: any) => onChangeAction({ ...value, [k]: v });

    return (
        <Box p={2} display="grid" gap={2}>
            <TextField label="Name (key)" value={value.name} onChange={(e) => patch('name', e.target.value)} />
            <TextField label="Label" value={value.label} onChange={(e) => patch('label', e.target.value)} />
            <TextField label="Placeholder" value={value.placeholder ?? ''} onChange={(e) => patch('placeholder', e.target.value)} />
            <FormControlLabel
                control={<Checkbox checked={!!value.required} onChange={(e) => patch('required', (e.target as HTMLInputElement).checked)} />}
                label="Required"
            />

            {(['text', 'textarea'].includes(value.type)) && (
                <>
                    <TextField type="number" label="minLength" value={value.minLength ?? ''} onChange={(e) => patch('minLength', e.target.value ? Number(e.target.value) : undefined)} />
                    <TextField type="number" label="maxLength" value={value.maxLength ?? ''} onChange={(e) => patch('maxLength', e.target.value ? Number(e.target.value) : undefined)} />
                </>
            )}

            {value.type === 'textarea' && (
                <TextField type="number" label="rows" value={value.rows ?? ''} onChange={(e) => patch('rows', e.target.value ? Number(e.target.value) : undefined)} />
            )}

            {value.type === 'number' && (
                <>
                    <TextField type="number" label="min" value={value.min ?? ''} onChange={(e) => patch('min', e.target.value ? Number(e.target.value) : undefined)} />
                    <TextField type="number" label="max" value={value.max ?? ''} onChange={(e) => patch('max', e.target.value ? Number(e.target.value) : undefined)} />
                    <TextField type="number" label="step" value={value.step ?? ''} onChange={(e) => patch('step', e.target.value ? Number(e.target.value) : undefined)} />
                </>
            )}

            {(['radio', 'select'].includes(value.type)) && (
                <TextField
                    label="Options (value:label per line)"
                    multiline
                    minRows={4}
                    value={(value.options || []).map((o: any) => `${o.value}:${o.label}`).join('\n')}
                    onChange={(e) => {
                        const opts = e.target.value
                            .split('\n')
                            .map((l) => {
                                const [v, ...rest] = l.split(':');
                                const lab = rest.join(':');
                                return v ? { value: v.trim(), label: (lab || v).trim() } : null;
                            })
                            .filter(Boolean);
                        patch('options', opts);
                    }}
                />
            )}

            {value.type === 'file' && (
                <>
                    <TextField label="accept (e.g. image/*)" value={value.accept ?? ''} onChange={(e) => patch('accept', e.target.value || undefined)} />
                    <TextField type="number" label="maxSizeMb" value={value.maxSizeMb ?? ''} onChange={(e) => patch('maxSizeMb', e.target.value ? Number(e.target.value) : undefined)} />
                </>
            )}
        </Box>
    );
}
