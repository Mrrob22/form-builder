'use client';
import * as React from 'react';
import { Button, Stack } from '@mui/material';

export default function Toolbar({
                                    onAddTextAction,
                                    onAddNumberAction,
                                    onAddTextareaAction,
                                    onSaveAction,
                                    onPublishAction,
                                }: {
    onAddTextAction: () => void;
    onAddNumberAction: () => void;
    onAddTextareaAction: () => void;
    onSaveAction: () => void;
    onPublishAction: () => void;
}) {
    return (
        <Stack direction="row" spacing={2}>
            <Button onClick={onAddTextAction}>+ Text</Button>
            <Button onClick={onAddNumberAction}>+ Number</Button>
            <Button onClick={onAddTextareaAction}>+ Textarea</Button>
            <Button variant="outlined" onClick={onSaveAction}>Зберегти</Button>
            <Button variant="contained" onClick={onPublishAction}>Публікувати</Button>
        </Stack>
    );
}
