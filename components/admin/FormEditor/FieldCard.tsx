'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function FieldCard({
                                      field,
                                      selected,
                                      onClickAction,
                                  }: {
    field: any;
    selected?: boolean;
    onClickAction?: () => void;
}) {
    return (
        <Card
            variant={selected ? 'elevation' : 'outlined'}
            onClick={onClickAction}
            sx={{ cursor: 'pointer' }}
        >
            <CardContent>
                <Typography variant="subtitle2">
                    {String(field.type).toUpperCase()} • {field.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {field.label}
                </Typography>
            </CardContent>
        </Card>
    );
}
