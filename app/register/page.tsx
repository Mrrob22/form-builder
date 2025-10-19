'use client';
import * as React from 'react';
import { useState } from 'react';
import {
    Box, Button, Card, CardContent, CardHeader, TextField, Typography, Stack, Alert, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState(false);

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setOk(false);

        if (pw !== pw2) {
            setErr('PASSWORD_MISMATCH');
            return;
        }
        if (pw.length < 8) {
            setErr('WEAK_PASSWORD_MIN_8');
            return;
        }

        setSubmitting(true);
        try {
            const r = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name, email, password: pw }),
            });
            if (r.ok) {
                setOk(true);
                setTimeout(() => (window.location.href = '/login'), 800);
            } else {
                const data = await r.json().catch(() => ({}));
                setErr(data?.error || 'REGISTER_FAILED');
            }
        } catch (e: any) {
            setErr('NETWORK_ERROR');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center', p: 2 }}>
            <Card sx={{ width: 460, maxWidth: '100%' }}>
                <CardHeader title="Реєстрація" subheader="Створення нового акаунта" />
                <CardContent>
                    <Stack component="form" onSubmit={register} spacing={2}>
                        {err && <Alert severity="error">{err}</Alert>}
                        {ok && <Alert severity="success">Реєстрація успішна! Перенаправляємо на вхід…</Alert>}

                        <TextField
                            label="Імʼя (необовʼязково)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Пароль (мін. 8)"
                            type="password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            autoComplete="new-password"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Повторіть пароль"
                            type="password"
                            value={pw2}
                            onChange={(e) => setPw2(e.target.value)}
                            autoComplete="new-password"
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? 'Реєстрація…' : 'Зареєструватися'}
                        </Button>
                    </Stack>

                    <Typography mt={2} variant="body2" color="text.secondary">
                        Вже є акаунт?{' '}
                        <MuiLink component={Link} href="/login">Увійти</MuiLink>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
