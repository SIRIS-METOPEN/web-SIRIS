import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Calculator,
  Download,
  Info,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [amountStr, setAmountStr] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('reguler');

  // Kalkulasi
  const amount = parseFloat(amountStr.replace(/[^0-9]/g, '')) || 0;

  const selectedCategory = useMemo(() => {
    return (
      MDR_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      MDR_CATEGORIES[1]
    );
  }, [selectedCategoryId]);

  const mdrFee = useMemo(() => {
    return (amount * selectedCategory.rate) / 100;
  }, [amount, selectedCategory]);

  const totalMerchantReceives = amount - mdrFee;

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
    // Only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmountStr(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Hero Section (Solid Blue Background) */}
      <section className="bg-[#0369A1] pt-16 pb-24 px-6 relative w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Edukasi Penggunaan QRIS
          </h1>
          <p className="text-[#E0F2FE] text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Pahami hak Anda sebagai konsumen. Tidak ada biaya tambahan
            (surcharge) bagi pembeli saat bertransaksi menggunakan QRIS.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1100px] mx-auto px-6 -mt-12 relative z-10 space-y-12">
        {/* Aturan Dasar & Hak Konsumen (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-[#E0F2FE] transition-colors">
            <CardContent className="p-6 sm:p-8">
              <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Hak Konsumen
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Berdasarkan peraturan Bank Indonesia, konsumen{' '}
                <strong>
                  tidak boleh dikenakan biaya tambahan (surcharge)
                </strong>{' '}
                dalam bentuk apa pun saat membayar menggunakan QRIS. Harga
                barang atau jasa yang dibayarkan harus sama persis dengan yang
                tertera.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    Membayar sesuai harga asli
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    Berhak menolak jika ada tambahan biaya
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-[#E0F2FE] transition-colors">
            <CardContent className="p-6 sm:p-8">
              <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Kewajiban Merchant
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Merchant diwajibkan menanggung biaya pemrosesan transaksi yang
                disebut <strong>MDR (Merchant Discount Rate)</strong>. Biaya MDR
                ini dipotong langsung dari total pembayaran yang masuk ke
                rekening merchant, bukan dibebankan di awal kepada pembeli.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    Dilarang menaikkan harga khusus pengguna QRIS
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    Dilarang meminta pembeli menanggung pajak MDR
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive MDR Calculator */}
        <Card className="bg-white border-slate-100 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#0369A1]/10 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-[#0369A1]" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Simulasi Pemotongan MDR (Merchant Discount Rate)
              </CardTitle>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Ketahui berapa biaya resmi yang ditanggung oleh merchant untuk
              setiap transaksi QRIS.
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="kategori-merchant"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Kategori Merchant
                </label>
                <div id="kategori-merchant" className="flex flex-wrap gap-2">
                  {MDR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        selectedCategoryId === cat.id
                          ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}{' '}
                      <span className="opacity-60 ml-1">({cat.rate}%)</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="nominal-transaksi"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Nominal Transaksi (Rp)
                </label>
                <Input
                  id="nominal-transaksi"
                  type="text"
                  placeholder="Contoh: 50000"
                  value={amountStr}
                  onChange={handleAmountChange}
                  className="w-full text-lg py-6 rounded-xl border-slate-200 focus-visible:ring-[#0369A1] focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Output Display */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 flex flex-col justify-center border border-slate-100">
              <div className="space-y-6">
                {/* Pembeli Bayar */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Konsumen Membayar
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Sesuai harga asli barang/jasa
                    </p>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {formatRupiah(amount)}
                  </p>
                </div>

                {/* Potongan MDR */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-red-500">
                      Potongan MDR ({selectedCategory.rate}%)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Ditanggung oleh merchant
                    </p>
                  </div>
                  <p className="text-lg font-bold text-red-600">
                    - {formatRupiah(mdrFee)}
                  </p>
                </div>

                {/* Diterima Merchant */}
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-base font-semibold text-[#0369A1]">
                      Merchant Menerima Bersih
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Masuk ke rekening merchant
                    </p>
                  </div>
                  <p className="text-2xl font-black text-[#0369A1]">
                    {formatRupiah(totalMerchantReceives)}
                  </p>
                </div>
              </div>

              {amount > 0 && (
                <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Info className="h-5 w-5 text-[#0369A1] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#0369A1] leading-relaxed">
                    Jika merchant meminta Anda untuk membayar{' '}
                    <strong>{formatRupiah(amount + mdrFee)}</strong> dengan
                    alasan tambahan biaya QRIS, itu adalah sebuah{' '}
                    <strong>pelanggaran</strong>.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTA & Download Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Card className="bg-slate-900 text-white border-transparent shadow-lg rounded-2xl overflow-hidden relative isolate">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-800 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
            <CardContent className="p-6 sm:p-8 flex flex-col h-full justify-between z-10 relative">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#38BDF8]" />
                  Unduh Regulasi Resmi
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">
                  Dapatkan salinan PDF peraturan Bank Indonesia mengenai
                  penyelenggaraan sistem pembayaran dan kebijakan MDR QRIS untuk
                  dipelajari lebih lanjut.
                </p>
              </div>
              <a
                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] font-semibold py-3 px-6 rounded-xl transition-colors w-max"
              >
                Unduh PDF Panduan
                <Download className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-[#0369A1] text-white border-transparent shadow-lg rounded-2xl overflow-hidden relative isolate">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
            <CardContent className="p-6 sm:p-8 flex flex-col h-full justify-between z-10 relative">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Menemukan Pelanggaran?
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-8">
                  Jika Anda menemukan merchant yang melanggar aturan dengan
                  membebankan biaya MDR, segera laporkan agar dapat ditindak
                  tegas.
                </p>
              </div>
              <Link to="/login" className="inline-block w-full">
                <Button className="w-full bg-white hover:bg-slate-50 text-[#0369A1] font-bold py-6 rounded-xl shadow-sm transition-all hover:shadow-md text-base">
                  Laporkan Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
