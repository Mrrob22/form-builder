'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({
                                          open,
                                          data,
                                          onCancelAction,
                                          onConfirmAction,
                                      }: {
    open: boolean;
    data: any;
    onCancelAction: () => void;
    onConfirmAction: () => void;
}) {
    return (
        <Dialog open={open} onClose={onCancelAction} fullWidth>
            <DialogTitle>Підтвердження даних</DialogTitle>
            <DialogContent>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancelAction}>Назад</Button>
                <Button onClick={onConfirmAction} variant="contained">
                    Підтвердити
                </Button>
            </DialogActions>
        </Dialog>
    );
}
