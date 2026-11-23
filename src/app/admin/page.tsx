import type { Metadata } from 'next';
import { AdminDashboard } from '@/features/admin/AdminDashboard';

export const metadata: Metadata = { title: 'Admin' };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Admin</h1>
      <p className="mb-8 mt-2 text-slate-500">Demo admin panel — no login in this demo. A real store would protect it with authentication (see project 5).</p>
      <AdminDashboard />
    </div>
  );
}
