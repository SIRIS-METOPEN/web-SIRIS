import { Link, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate('/login');
            toast.success('Berhasil keluar');
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Gagal keluar');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0369A1]">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
          <span className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            SIRIS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold text-[#0369A1] border-b-2 border-[#0369A1] py-1"
          >
            Beranda
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            Edukasi QRIS
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            Laporkan
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            Status
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Auth / Actions */}
        <div className="flex items-center gap-4">
          {!isPending && session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline-block text-sm font-medium text-[#0F172A]">
                  Halo, {session.user.name.split(' ')[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-[#64748B] hover:text-[#EF4444] hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-block text-sm font-semibold text-[#0F172A] hover:text-[#0369A1] transition-colors"
              >
                Masuk
              </Link>
              <Button className="bg-[#006399] hover:bg-[#00507d] text-white rounded-lg px-5 font-medium shadow-sm transition-colors">
                Laporkan Sekarang
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
