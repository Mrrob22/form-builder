import Link from 'next/link';

export default function AdminHome() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Адмін-панель</h1>
            <ul>
                <li><Link href="/admin/forms">Форми</Link></li>
            </ul>
        </main>
    );
}
