'use client';
import * as React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    Box, Button, Card, CardContent, CardHeader, TextField, Typography, Stack, Alert, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const params = useSearchParams();
    const oauthErr = params.get('error');

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setSubmitting(true);
        try {
            const r = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (r.ok) {
                window.location.href = '/admin';
            } else {
                const data = await r.json().catch(() => ({}));
                setErr(data?.error || 'INVALID_CREDENTIALS');
            }
        } catch (e: any) {
            setErr('NETWORK_ERROR');
        } finally {
            setSubmitting(false);
        }
    };

    const google = async () => {
        await signIn('google', { callbackUrl: '/api/auth/complete' });
    };

    return (
        <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center', p: 2 }}>
            <Card sx={{ width: 420, maxWidth: '100%' }}>
                <CardHeader title="Вхід" subheader="Пароль з БД або Google OAuth" />
                <CardContent>
                    <Stack component="form" onSubmit={login} spacing={2}>
                        {(err || oauthErr) && (
                            <Alert severity="error">{err || oauthErr}</Alert>
                        )}
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
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? 'Вхід…' : 'Увійти'}
                        </Button>
                    </Stack>

                    <Box mt={2}>
                        <Button onClick={google} variant="outlined" fullWidth>
                            Увійти через Google
                        </Button>
                    </Box>

                    <Typography mt={2} variant="body2" color="text.secondary">
                        Немає акаунта?{' '}
                        <MuiLink component={Link} href="/register">Зареєструватися</MuiLink>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
