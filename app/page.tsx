import Link from 'next/link';

export default function Home() {
  return (
      <main style={{ padding: 24 }}>
        <h1>Form Builder</h1>
        <Link href="/public">Публичная часть</Link><br />
        <Link href="/admin">Админка</Link>
      </main>
  );
}
