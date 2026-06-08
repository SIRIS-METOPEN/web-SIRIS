import { useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { signUp, signIn, signOut } from '../lib/auth-client';
import { toast } from 'sonner';
import { Footer } from '../components/footer';

const signUpSchema = z.object({
  name: z.string().min(2, 'Nama terlalu pendek'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor telepon tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  terms: z.boolean().refine((val) => val === true, 'Anda harus menyetujui S&K'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { terms: false },
  });

  const termsValue = useWatch({ control, name: 'terms' });

  const onSubmit = (data: SignUpFormValues) => {
    startTransition(async () => {
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        toast.error(error.message || 'Gagal mendaftar');
      } else {
        await signOut();
        toast.success('Pendaftaran berhasil! Silakan login.');
        navigate('/login');
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

  const handleGoogleSignUp = () => {
    startTransition(async () => {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/',
        errorCallbackURL: window.location.origin + '/signup',
      });
      if (error) {
        toast.error('Gagal mendaftar dengan Google');
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
      <div className="flex-grow flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-[1100px] bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row overflow-hidden">
          {/* Left Side: Blue Branding Panel */}
          <div className="relative w-full md:w-[45%] bg-[#104D79] text-white p-10 md:p-12 flex flex-col overflow-hidden">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
              <img
                src="/Abstract Pattern Overlays.png"
                alt="Pattern"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Logo Header */}
            <div className="relative z-10 flex items-center mb-16">
              <Landmark className="w-6 h-6 mr-3 text-white" />
              <span className="text-xl font-bold tracking-wide">SIRIS</span>
            </div>

            {/* Main Typographic Content */}
            <div className="relative z-10 flex-grow">
              <h1 className="text-[40px] md:text-[44px] leading-[1.15] font-bold mb-6 tracking-tight">
                Sistem Informasi
                <br />
                Pelaporan
                <br />
                Pelanggaran
                <br />
                QRIS
              </h1>
              <p className="text-blue-100 text-[16px] leading-relaxed max-w-[90%]">
                Membangun ekosistem sistem pembayaran yang aman, andal, dan
                terpercaya bagi seluruh rakyat Indonesia.
              </p>
            </div>

            {/* Security Badge */}
            <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <div className="flex items-center mb-2">
                <ShieldCheck className="w-5 h-5 text-[#FDBA74] mr-2" />
                <h3 className="font-semibold text-sm tracking-wide">
                  KEAMANAN TERJAMIN
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Data Anda dilindungi dengan standar enkripsi perbankan nasional
                untuk memastikan privasi dan integritas informasi.
              </p>
            </div>
          </div>

          {/* Right Side: Form Panel */}
          <div className="w-full md:w-[55%] p-10 md:p-14 bg-white flex flex-col justify-center">
            <h2 className="text-[32px] font-bold text-[#0F172A] mb-2 tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="text-[#64748B] text-[15px] mb-8">
              Silakan lengkapi formulir di bawah ini untuk bergabung dengan
              platform SIRIS.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[#334155] font-semibold text-sm"
                >
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 z-10 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="name"
                    placeholder="Masukkan nama sesuai identitas"
                    className="pl-11 h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#0F172A]  placeholder:text-[#94A3B8] focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                    {...register('name')}
                    disabled={isPending}
                  />
                </div>
                {errors.name && (
                  <p className="text-[13px] text-[#EF4444]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Alamat Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#334155] font-semibold text-sm"
                >
                  Alamat Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 z-10 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="namaanda@gmail.com"
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

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-[#334155] font-semibold text-sm"
                >
                  Nomor Telepon
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 z-10 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0812..."
                    className="pl-11 h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#0F172A]  placeholder:text-[#94A3B8] focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                    {...register('phone')}
                    disabled={isPending}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[13px] text-[#EF4444]">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Kata Sandi */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[#334155] font-semibold text-sm"
                >
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 z-10 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    className="pl-11 pr-11 h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#0F172A]  placeholder:text-[#94A3B8] focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                    {...register('password')}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 z-10 text-[#94A3B8] hover:text-[#475569] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-[#64748B] text-[13px]">
                  Gunakan kombinasi huruf, angka, dan simbol.
                </p>
                {errors.password && (
                  <p className="text-[13px] text-[#EF4444] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={termsValue}
                  onCheckedChange={(checked) =>
                    setValue('terms', checked as boolean)
                  }
                  disabled={isPending}
                  className="mt-1 w-5 h-5 rounded-[4px] border-[#CBD5E1]  bg-white  data-[state=checked]:bg-[#0369A1] data-[state=checked]:border-[#0369A1] "
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-[14px] font-normal text-[#475569]  leading-[1.6] cursor-pointer"
                  >
                    Saya menyetujui{' '}
                    <span className="font-semibold text-[#0369A1]">
                      Syarat & Ketentuan
                    </span>{' '}
                    serta{' '}
                    <span className="font-semibold text-[#0369A1]">
                      Kebijakan Privasi
                    </span>{' '}
                    yang berlaku di platform SIRIS.
                  </label>
                  {errors.terms && (
                    <p className="text-[13px] text-[#EF4444]">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-[48px] rounded-lg bg-[#006399] hover:bg-[#00507d] text-white font-medium text-[15px] transition-colors"
                  disabled={isPending}
                >
                  {isPending ? 'Memproses...' : 'Daftar Akun'}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={handleGoogleSignUp}
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

            <div className="relative mt-8 mb-6">
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
              className="w-full h-[48px] rounded-lg border-[#CBD5E1]  bg-white  text-[#475569]  font-medium hover:bg-[#F8FAFC]  hover:text-[#475569]  transition-colors"
            >
              <Landmark className="w-5 h-5 mr-2" />
              Lanjutkan sebagai Anonim
            </Button>

            <p className="text-center text-[15px] text-[#64748B] mt-8">
              Sudah memiliki akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#0369A1] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
