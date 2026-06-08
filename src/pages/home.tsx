import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  ShieldCheck,
  WalletCards,
  LineChart,
  AlertTriangle,
  Send,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter',sans-serif]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#F8F9FF] pt-16 pb-24 px-6">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-3 py-1.5 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Resmi dari Bank Indonesia
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-[#0F172A] leading-[1.15] tracking-tight">
                Integritas QRIS, Keamanan Bersama
              </h1>
              <p className="text-[#475569] text-lg leading-relaxed">
                SIRIS adalah portal resmi untuk melaporkan penyalahgunaan atau
                ketidaksesuaian implementasi QRIS sesuai dengan standar regulasi
                sistem pembayaran nasional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-[#006399] hover:bg-[#00507d] text-white h-12 px-6 rounded-lg text-[15px] font-medium transition-all gap-2 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20">
                  Laporkan Sekarang
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-lg border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] font-medium transition-colors bg-white"
                >
                  Pelajari Aturan
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[480px]">
              {/* Replace with the actual image provided by user */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100 bg-white">
                <img
                  src="/QRIS Payment Secure.png"
                  alt="Aplikasi Layanan QRIS"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-emerald-50/50 blur-3xl rounded-full" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-slate-100 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-slate-200">
              <div className="flex flex-col items-center md:items-start md:px-8 text-center md:text-left">
                <div className="text-4xl font-bold text-[#0369A1] tracking-tight mb-2">
                  12.4K
                </div>
                <div className="text-sm font-medium text-[#64748B]">
                  Total Laporan
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start md:px-8 text-center md:text-left">
                <div className="text-4xl font-bold text-[#10B981] tracking-tight mb-2">
                  98.2%
                </div>
                <div className="text-sm font-medium text-[#64748B]">
                  Kasus Selesai
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start md:px-8 text-center md:text-left">
                <div className="text-4xl font-bold text-[#F59E0B] tracking-tight mb-2">
                  450+
                </div>
                <div className="text-sm font-medium text-[#64748B]">
                  Penyedia Jasa (PJP)
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start md:px-8 text-center md:text-left">
                <div className="text-4xl font-bold text-[#334155] tracking-tight mb-2">
                  247
                </div>
                <div className="text-sm font-medium text-[#64748B]">
                  Pemantauan Aktif
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Peraturan */}
        <section className="py-12 bg-white px-6">
          <div className="max-w-[1200px] mx-auto bg-[#B45309] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-xl shadow-orange-900/10">
            <div className="bg-white/20 p-3 rounded-xl shrink-0">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Peraturan Bank Indonesia No. 23/6/PBI/2021
              </h3>
              <p className="text-orange-100 text-[15px] leading-relaxed md:w-11/12">
                Setiap Penyelenggara Jasa Pembayaran (PJP) dan Merchant wajib
                mematuhi standar keamanan QRIS. Pelanggaran terhadap standar ini
                dapat dikenakan sanksi administratif hingga pencabutan izin
                operasional.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#F8F9FF] px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
                Mengapa Harus Melapor?
              </h2>
              <p className="text-[#64748B] text-lg">
                Melaporkan ketidaksesuaian adalah langkah nyata dalam menjaga
                ekosistem sistem pembayaran digital yang aman bagi seluruh
                rakyat Indonesia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#E0F2FE] rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-[#0369A1]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">
                  Lindungi Konsumen
                </h3>
                <p className="text-[#64748B] leading-relaxed text-[15px]">
                  Laporan Anda mencegah penyalahgunaan dana dan penipuan yang
                  merugikan pengguna akhir QRIS di seluruh Indonesia.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#EDE9FE] rounded-xl flex items-center justify-center mb-6">
                  <WalletCards className="w-7 h-7 text-[#7C3AED]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">
                  Kepatuhan Regulasi
                </h3>
                <p className="text-[#64748B] leading-relaxed text-[15px]">
                  Memastikan setiap PJP mengikuti protokol standar Bank
                  Indonesia untuk menjaga stabilitas sistem pembayaran nasional.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#FFEDD5] rounded-xl flex items-center justify-center mb-6">
                  <LineChart className="w-7 h-7 text-[#EA580C]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">
                  Kualitas Layanan
                </h3>
                <p className="text-[#64748B] leading-relaxed text-[15px]">
                  Data laporan digunakan sebagai bahan evaluasi untuk terus
                  meningkatkan performa dan kenyamanan layanan QRIS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Flow Section */}
        <section className="py-24 bg-white px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              Alur Pelaporan SIRIS
            </h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto mb-16">
              Proses transparan dan terukur untuk setiap laporan yang Anda
              kirimkan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16 relative">
              {/* Connector Line for Desktop */}
              <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10" />

              {[
                {
                  id: 1,
                  title: 'Identifikasi',
                  desc: 'Temukan ketidaksesuaian pada Merchant atau PJP.',
                },
                {
                  id: 2,
                  title: 'Dokumentasi',
                  desc: 'Ambil foto bukti transaksi atau tampilan QRIS.',
                },
                {
                  id: 3,
                  title: 'Isi Formulir',
                  desc: 'Lengkapi data laporan melalui portal SIRIS.',
                },
                {
                  id: 4,
                  title: 'Verifikasi',
                  desc: 'Tim Bank Indonesia memverifikasi laporan Anda.',
                },
                {
                  id: 5,
                  title: 'Tindak Lanjut',
                  desc: 'Pemberian sanksi atau edukasi kepada pihak terkait.',
                },
              ].map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white border-[4px] border-[#F1F5F9] flex items-center justify-center shadow-sm text-xl font-bold text-[#0F172A] mb-6">
                    {step.id}
                  </div>
                  <h4 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <Button className="bg-[#006399] hover:bg-[#00507d] text-white h-14 px-8 rounded-xl text-[16px] font-medium transition-all shadow-lg shadow-blue-900/10">
              Mulai Laporan Baru
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
