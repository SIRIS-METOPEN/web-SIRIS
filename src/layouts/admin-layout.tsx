import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useSession, signOut } from '@/lib/auth-client';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileSearch,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLayout() {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Memuat Sesi Admin...
        </p>
      </div>
    );
  }

  // Allow admin dashboard access only if user is logged in and has admin role
  const user = session?.user as
    | { name?: string | null; email?: string; role?: string }
    | undefined;
  if (!session?.user || user?.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Berhasil keluar dari panel admin');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Gagal keluar');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Laporan Masuk', icon: FileSpreadsheet, path: '/admin/reports' },
    {
      name: 'Investigasi',
      icon: FileSearch,
      path: '/admin/investigasi',
      disabled: true,
    },
    { name: 'Statistik', icon: BarChart3, path: '/admin/statistik' },
    {
      name: 'Pengaturan',
      icon: Settings,
      path: '/admin/settings',
      disabled: true,
    },
  ];

  const isDetailPage =
    location.pathname.includes('/reports/') &&
    location.pathname !== '/admin/reports';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#090D1A] border-r border-[#151D30] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="h-20 flex items-center px-6 border-b border-[#151D30] gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white">
                SIRIS
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider">
                Regulator BI
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin' ||
                    location.pathname === '/admin/'
                  : location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.name}
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed text-slate-500'
                      : isActive
                        ? 'bg-[#1E293B] text-sky-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#111C38]/50'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive && !item.disabled
                        ? 'text-sky-400'
                        : 'text-slate-500'
                    }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-[#151D30]">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl justify-start gap-3 px-4 py-3 h-auto"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Panel Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
          {isDetailPage ? (
            /* Detail Header Breadcrumbs */
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                type="button"
                className="hover:text-sky-600 focus:outline-none"
                onClick={() => navigate('/admin')}
              >
                Dashboard
              </button>
              <span className="text-slate-300">/</span>
              <button
                type="button"
                className="hover:text-sky-600 focus:outline-none"
                onClick={() => navigate('/admin')}
              >
                Semua Laporan
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-bold">Detail Laporan</span>
            </div>
          ) : (
            /* Dashboard Header Title */
            <h2 className="text-lg font-bold text-slate-800">
              Dashboard Utama
            </h2>
          )}

          {/* Header Right Actions */}
          <div className="flex items-center gap-4">
            {!isDetailPage && (
              /* Global Search Bar (Only on list/dashboard) */
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  aria-label="Cari tiket secara global"
                  placeholder="Cari laporan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            )}

            {/* Notification Bell */}
            <button
              aria-label="Notifikasi"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Admin Profile Widget */}
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  Admin BI
                </span>
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Pusat Investigasi
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-700 text-sm overflow-hidden">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'BI'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
