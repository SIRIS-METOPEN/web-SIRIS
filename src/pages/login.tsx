import { useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { signIn } from '../lib/auth-client';
import { toast } from 'sonner';
import { Footer } from '../components/footer';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const rememberMeValue = useWatch({ control, name: 'rememberMe' });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      });

      if (error) {
        console.error('Login Error:', error);
        toast.error(error.message || 'Gagal masuk');
      } else {
        toast.success('Berhasil masuk!');
        navigate('/');
      }
    });
  };

  const handleAnonymousLogin = () => {
    startTransition(async () => {
      const { error } = await signIn.anonymous();
      if (error) {
        toast.error('Gagal masuk sebagai tamu');
      } else {
        toast.success('Berhasil masuk sebagai tamu');
        navigate('/');
      }
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/',
      });
      if (error) {
        toast.error('Gagal masuk dengan Google');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#0369A1] font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo and App Header */}
        <div className="text-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E0F2FE] border border-blue-100 mx-auto mb-3">
            <Landmark className="h-7 w-7 text-[#0369A1]" />
          </div>
          <h2 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            SIRIS
          </h2>
          <p className="text-[#64748B] text-[14px]">
            Sistem Informasi Pelaporan Pelanggaran QRIS
          </p>
        </div>

        {/* Card Panel */}
        <div className="w-full max-w-[500px] bg-white rounded-xl shadow-sm border border-slate-100 p-8 md:p-10 flex flex-col">
          <h1 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight text-center">
            Login ke Akun Anda
          </h1>
          <p className="text-[#64748B] text-[15px] mb-8 text-center">
            Masuk untuk mengakses portal pelaporan Anda.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Alamat Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#334155] font-semibold text-sm"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 z-10 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-11 h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#0F172A]  placeholder:text-[#94A3B8] focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                  {...register('email')}
                  disabled={isPending}
                />
              </div>
              {errors.email && (
                <p className="text-[13px] text-[#EF4444]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Kata Sandi */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[#334155] font-semibold text-sm"
                >
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-xs font-semibold text-[#0369A1] hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 z-10 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#0F172A]  placeholder:text-[#94A3B8] focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                  {...register('password')}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 z-10 text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[13px] text-[#EF4444]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-3 pt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMeValue}
                onCheckedChange={(checked) =>
                  setValue('rememberMe', checked as boolean)
                }
                disabled={isPending}
                className="w-5 h-5 rounded-[4px] border-[#CBD5E1]  bg-white  data-[state=checked]:bg-[#0369A1] data-[state=checked]:border-[#0369A1] "
              />
              <label
                htmlFor="rememberMe"
                className="text-[14px] font-normal text-[#475569]  cursor-pointer"
              >
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full h-[48px] rounded-lg bg-[#006399] hover:bg-[#00507d] text-white font-medium text-[15px] transition-colors"
                disabled={isPending}
              >
                {isPending ? 'Memproses...' : 'Login'}
              </Button>

              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                onClick={handleGoogleSignIn}
                className="w-full h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#475569]  font-medium hover:bg-[#F8FAFC]  hover:text-[#475569]  transition-colors flex items-center justify-center gap-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </form>

          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#94A3B8] font-medium tracking-wider">
                ATAU
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={handleAnonymousLogin}
            className="w-full h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#475569]  font-medium hover:bg-[#F8FAFC]  hover:text-[#475569]  transition-colors flex items-center justify-center gap-3"
          >
            <Landmark className="w-5 h-5 mr-2" />
            Lanjutkan sebagai Anonim
          </Button>

          <p className="text-center text-[15px] text-[#64748B] mt-8">
            Belum memiliki akun?{' '}
            <Link
              to="/signup"
              className="font-semibold text-[#0369A1] hover:underline"
            >
              Daftar Akun
            </Link>
          </p>
        </div>

        {/* Secure connection indicator */}
        <div className="flex items-center justify-center text-xs text-[#94A3B8] gap-1.5 mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Koneksi Aman & Terenkripsi AES-256</span>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
