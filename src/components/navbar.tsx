import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { LogOut, Menu, X } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getDesktopClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'text-sm font-semibold text-[#0369A1] border-b-2 border-[#0369A1] py-1'
      : 'text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-1 border-b-2 border-transparent';
  };

  const getMobileClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'text-sm font-semibold text-[#0369A1]'
      : 'text-sm font-medium text-[#475569] hover:text-[#0F172A]';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-siris.png"
            alt="SIRIS Logo"
            className="h-8 object-contain brightness-0"
          />
          <span className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            SIRIS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={getDesktopClass('/')}>
            Beranda
          </Link>
          <Link to="/edukasi-qris" className={getDesktopClass('/edukasi-qris')}>
            Edukasi QRIS
          </Link>
          <Link to="/laporkan" className={getDesktopClass('/laporkan')}>
            Laporkan
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-1 border-b-2 border-transparent"
          >
            Status
          </Link>
          <Link to="/faq" className={getDesktopClass('/faq')}>
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
              <Button
                onClick={() => navigate('/laporkan')}
                className="hidden md:flex bg-[#006399] hover:bg-[#00507d] text-white rounded-lg px-5 font-medium shadow-sm transition-colors"
              >
                Laporkan Sekarang
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#0F172A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-4 shadow-lg absolute w-full">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className={getMobileClass('/')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/edukasi-qris"
              className={getMobileClass('/edukasi-qris')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Edukasi QRIS
            </Link>
            <Link
              to="/laporkan"
              className={getMobileClass('/laporkan')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Laporkan
            </Link>
            <Link
              to="#"
              className="text-sm font-medium text-[#475569] hover:text-[#0F172A]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Status
            </Link>
            <Link
              to="/faq"
              className={getMobileClass('/faq')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {!isPending && !session && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#0F172A] text-center w-full py-2 border border-slate-200 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/laporkan');
                  }}
                  className="w-full bg-[#006399] hover:bg-[#00507d] text-white rounded-lg px-5 font-medium shadow-sm transition-colors"
                >
                  Laporkan Sekarang
                </Button>
              </>
            )}
            {!isPending && session && (
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/laporkan');
                }}
                className="w-full bg-[#006399] hover:bg-[#00507d] text-white rounded-lg px-5 font-medium shadow-sm transition-colors"
              >
                Laporkan Sekarang
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
