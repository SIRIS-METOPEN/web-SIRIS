import { Outlet } from 'react-router';
import { Navbar } from '@/components/navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
