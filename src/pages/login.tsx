import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Building2 } from 'lucide-react';
import { useSession, signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LoginPage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      navigate('/');
    }
  }, [session, isPending, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to initialize Google login');
      setIsLoggingIn(false);
    }
  };

  if (isPending || session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium tracking-wide text-slate-400">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Decorative Gradients */}
      <div className="absolute top-0 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-0 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-700/50">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Welcome to SIRIS
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            Integrated Research & Innovation System. Sign in to access your
            dashboard.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="relative w-full flex items-center justify-center gap-3 bg-white text-slate-950 font-semibold hover:bg-slate-100 border border-slate-200 rounded-xl py-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {isLoggingIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Sign in with Google
          </Button>
        </div>

        <div className="relative mt-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-500 uppercase">
            <span className="bg-slate-950 px-2 tracking-wider">
              Secured Session
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
