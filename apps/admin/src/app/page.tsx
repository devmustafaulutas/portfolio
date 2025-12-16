import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <Link href="/admin">Admin</Link>
    </main>
  );
}
