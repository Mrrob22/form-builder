'use client';

import { Paper, Box } from '@mui/material';
import FieldCard from './FieldCard';

export default function EditorCanvas({
                                         fields,
                                         selectedId,
                                         onSelectAction,
                                     }: {
    fields: any[];
    selectedId?: string;
    onSelectAction: (id: string) => void;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box display="grid" gap={1}>
                {fields.map((f) => (
                    <FieldCard
                        key={f.id}
                        field={f}
                        selected={f.id === selectedId}
                        onClickAction={() => onSelectAction(f.id)}
                    />
                ))}
            </Box>
        </Paper>
    );
}
