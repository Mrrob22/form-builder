'use client';

import {
    TextField, Box, FormControlLabel, Checkbox as MUICheckbox,
    RadioGroup, Radio, FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';

export type FieldDTO = {
    id: string;
    type: 'text'|'number'|'textarea'|'radio'|'checkbox'|'select'|'file'|'date';
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    rows?: number;
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
    accept?: string;
    maxSizeMb?: number;
};

export default function DynamicForm({
                                        fields,
                                        values,
                                        onChangeAction,
                                    }: {
    fields: FieldDTO[];
    values: Record<string, any>;
    onChangeAction: (name: string, value: any) => void;
}) {
    return (
        <Box display="grid" gap={2}>
            {fields.map((f) => {
                const commonTF = {
                    label: f.label,
                    placeholder: f.placeholder,
                    required: f.required,
                    value: values[f.name] ?? '',
                    fullWidth: true,
                } as const;

                if (f.type === 'text')
                    return (
                        <TextField
                            key={f.id}
                            {...commonTF}
                            onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).value)}
                            slotProps={{
                                htmlInput: {
                                    minLength: f.minLength,
                                    maxLength: f.maxLength,
                                },
                            }}
                        />
                    );

                if (f.type === 'number')
                    return (
                        <TextField
                            key={f.id}
                            type="number"
                            {...commonTF}
                            onChange={(e) => onChangeAction(f.name, Number((e.target as HTMLInputElement).value))}
                            slotProps={{
                                htmlInput: {
                                    min: f.min,
                                    max: f.max,
                                    step: f.step,
                                },
                            }}
                        />
                    );

                if (f.type === 'textarea')
                    return (
                        <TextField
                            key={f.id}
                            {...commonTF}
                            multiline
                            rows={f.rows ?? 4}
                            onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).value)}
                            slotProps={{
                                htmlInput: {
                                    minLength: f.minLength,
                                    maxLength: f.maxLength,
                                },
                            }}
                        />
                    );

                if (f.type === 'checkbox')
                    return (
                        <FormControlLabel
                            key={f.id}
                            control={
                                <MUICheckbox
                                    checked={!!values[f.name]}
                                    onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).checked)}
                                />
                            }
                            label={f.label}
                        />
                    );

                if (f.type === 'radio')
                    return (
                        <RadioGroup
                            key={f.id}
                            value={values[f.name] ?? ''}
                            onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).value)}
                        >
                            {(f.options || []).map((o) => (
                                <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
                            ))}
                        </RadioGroup>
                    );

                if (f.type === 'select') {
                    const labelId = `${f.id}-label`;
                    const selectId = `${f.id}-select`;
                    return (
                        <FormControl key={f.id} fullWidth>
                            <InputLabel id={labelId}>{f.label}</InputLabel>
                            <Select
                                id={selectId}
                                labelId={labelId}
                                value={values[f.name] ?? ''}
                                label={f.label}
                                onChange={(e) => onChangeAction(f.name, e.target.value)}
                                variant="outlined"
                            >
                                {(f.options || []).map((o) => (
                                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                }

                if (f.type === 'date')
                    return (
                        <TextField
                            key={f.id}
                            type="date"
                            label={f.label}
                            value={values[f.name] ?? ''}
                            onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).value)}
                            slotProps={{ inputLabel: { shrink: true } }} 
                            fullWidth
                        />
                    );

                if (f.type === 'file')
                    return (
                        <Button key={f.id} component="label" variant="outlined">
                            {f.label}
                            <input
                                hidden
                                type="file"
                                accept={f.accept}
                                onChange={(e) => onChangeAction(f.name, (e.target as HTMLInputElement).files?.[0] || null)}
                            />
                        </Button>
                    );

                return null;
            })}
        </Box>
    );
}
