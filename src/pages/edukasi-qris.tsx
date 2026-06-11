import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Calculator,
  Download,
  AlertTriangle,
  Receipt,
  Percent,
  Banknote,
  Coins,
  Gavel,
  Send,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

// MDR Data
const MDR_CATEGORIES = [
  { id: 'umi', name: 'Usaha Mikro (UMI)', rate: 0.3 },
  { id: 'reguler', name: 'Reguler', rate: 0.7 },
  { id: 'pendidikan', name: 'Pendidikan', rate: 0.6 },
  { id: 'spbu', name: 'SPBU', rate: 0.4 },
  { id: 'bansos', name: 'Donasi / Bansos', rate: 0.0 },
];

export default function EdukasiQRISPage() {
  const [amountStr, setAmountStr] = useState('100000');
  const [selectedCategoryId, setSelectedCategoryId] = useState('umi');

  // Kalkulasi
  const amount = parseFloat(amountStr.replace(/[^0-9]/g, '')) || 0;

  const selectedCategory = useMemo(() => {
    return (
      MDR_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      MDR_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  const mdrFee = useMemo(() => {
    return (amount * selectedCategory.rate) / 100;
  }, [amount, selectedCategory]);

  const illegalSurcharge = useMemo(() => {
    // Simulasi surcharge 2% yang sering terjadi di lapangan
    return (amount * 2) / 100;
  }, [amount]);

  // Format Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(val);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      {/* Hero Section */}
      <section className="bg-[#005282] relative w-full overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <ShieldCheck className="w-96 h-96 text-white" strokeWidth={1} />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-20 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm mb-6">
              Pusat Informasi Regulasi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Edukasi & Hak Konsumen QRIS
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-8 max-w-xl font-light leading-relaxed">
              Pahami regulasi Bank Indonesia mengenai penggunaan QRIS. Pastikan
              transaksi Anda bebas dari biaya tambahan ilegal (surcharge) dan
              biaya admin tersembunyi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Calculator (Col span 5) */}
          <div className="lg:col-span-5">
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-full">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#0369A1] p-1.5 rounded text-white">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kalkulator MDR vs Surcharge
                  </h2>
                </div>

                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Simulasi ini menunjukkan biaya yang seharusnya ditanggung
                  Merchant (MDR), bukan dibebankan kepada Anda.
                </p>

                <div className="space-y-6">
                  {/* Nominal */}
                  <div>
                    <label
                      htmlFor="nominal-transaksi"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Nominal Transaksi (Rp)
                    </label>
                    <Input
                      id="nominal-transaksi"
                      type="text"
                      placeholder="Contoh: 100000"
                      value={amountStr}
                      onChange={handleAmountChange}
                      className="w-full text-base py-5 rounded-lg border-slate-200 focus-visible:ring-[#0369A1] focus-visible:border-[#0369A1]"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label
                      htmlFor="kategori-merchant"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Kategori Merchant
                    </label>
                    <div className="relative">
                      <select
                        id="kategori-merchant"
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                      >
                        {MDR_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} - {cat.rate}%
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Output Box */}
                  <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-100 mt-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">
                        Official MDR (Beban Toko)
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {formatRupiah(mdrFee)}
                      </span>
                    </div>
                    <div className="h-px w-full bg-slate-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">
                        Potensi Surcharge Ilegal (Beban Anda)
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {formatRupiah(illegalSurcharge)} (2%)
                      </span>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-900 leading-relaxed">
                      <strong>PENTING:</strong> Surcharge (biaya tambahan)
                      dilarang oleh BI. Nilai MDR di atas adalah kewajiban
                      Merchant dan <strong>TIDAK BOLEH</strong> ditagihkan ke
                      pembeli.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Identifikasi & Dasar Hukum (Col span 7) */}
          <div className="lg:col-span-7 space-y-6 pt-4 lg:pt-0">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 lg:ml-2">
              Cara Mengidentifikasi Pelanggaran
            </h2>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <Card className="bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex gap-4">
                  <div className="bg-red-50 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                    <Banknote className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Biaya Admin Flat
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kasir meminta biaya tetap (misal: Rp2.500) setiap
                      transaksi QRIS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex gap-4">
                  <div className="bg-red-50 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                    <Percent className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Markup Persentase
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Harga naik 2-3% hanya jika Anda membayar menggunakan QRIS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex gap-4">
                  <div className="bg-red-50 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                    <Coins className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Minimum Belanja
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Merchant menolak pembayaran QRIS jika belanja di bawah
                      nominal tertentu.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex gap-4">
                  <div className="bg-red-50 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                    <Receipt className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Struk Terpisah
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Biaya tambahan dicatat secara manual di luar struk resmi
                      kasir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dasar Hukum Card */}
            <Card className="bg-[#F1F5F9] border-0 shadow-sm rounded-2xl mt-6">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="h-5 w-5 text-[#0369A1]" />
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Dasar Hukum: PBI No. 23/6/PBI/2021
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Bank Indonesia secara tegas melarang Merchant/Pedagang
                  mengenakan biaya tambahan (surcharge) kepada pengguna QRIS.
                  Kebijakan ini bertujuan untuk:
                </p>
                <ul className="list-disc list-outside ml-4 space-y-2 mb-6">
                  <li className="text-sm text-slate-600 pl-1">
                    Mendorong inklusi keuangan digital yang efisien.
                  </li>
                  <li className="text-sm text-slate-600 pl-1">
                    Menjaga perlindungan konsumen dari biaya tak terduga.
                  </li>
                  <li className="text-sm text-slate-600 pl-1">
                    Menciptakan ekosistem pembayaran non-tunai yang transparan.
                  </li>
                </ul>
                <a
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0369A1] hover:text-[#0284C7] transition-colors"
                >
                  Unduh Dokumen PBI Lengkap
                  <Download className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 mb-16 flex flex-col items-center text-center">
          <div className="mb-4">
            <AlertTriangle className="h-10 w-10 text-[#0369A1]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
            Menemukan Pelanggaran?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Jangan biarkan praktik ilegal merugikan Anda dan konsumen lainnya.
            Lapor sekarang untuk ekosistem pembayaran yang lebih sehat di
            Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/login">
              <Button className="bg-[#005282] hover:bg-[#003d61] text-white px-8 py-6 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-2 w-full sm:w-auto">
                <Send className="h-4 w-4" />
                Laporkan Pelanggaran
              </Button>
            </Link>
            <Link to="/faq">
              <Button
                variant="outline"
                className="bg-white text-[#005282] border-[#005282] hover:bg-slate-50 px-8 py-6 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 w-full sm:w-auto"
              >
                <FileText className="h-4 w-4" />
                Panduan Pelaporan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
