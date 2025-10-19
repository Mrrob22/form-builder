import Link from 'next/link';

export default function Home() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Form Builder</h1>
            <ul>
                <li><Link href="/public">Публічна частина</Link></li>
                <li><Link href="/admin">Адмінка</Link></li>
                <li><Link href="/login">Вхід</Link></li>
                <li><Link href="/register">Реєстрація</Link></li>
            </ul>
        </main>
    );
}
