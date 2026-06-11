import { useState, useMemo } from 'react';
import { Search, Mail, PhoneCall, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

// Memisahkan data statis di luar komponen untuk mencegah re-render yang tidak perlu (Best Practice)
const FAQ_DATA = [
  {
    id: 'faq-1',
    question: 'Apakah identitas saya dijamin aman dan anonim?',
    answer:
      'Ya. SIRIS menggunakan enkripsi end-to-end. Data pribadi Anda tidak akan pernah diserahkan kepada pihak merchant yang Anda laporkan. Kerahasiaan pelapor adalah prioritas utama kami dalam menjaga ekosistem pembayaran yang sehat.',
  },
  {
    id: 'faq-2',
    question: 'Berapa lama laporan saya akan diproses?',
    answer:
      'Tim Bank Indonesia akan meninjau laporan Anda dalam waktu maksimal 1x24 jam kerja. Tindak lanjut ke pihak merchant terkait biasanya memakan waktu 3-7 hari kerja tergantung kompleksitas dan validasi bukti pelanggaran.',
  },
  {
    id: 'faq-3',
    question: 'Apa bukti transaksi yang sah?',
    answer:
      'Bukti sah dapat berupa tangkapan layar (screenshot) bukti transfer m-banking/e-wallet yang menunjukkan adanya penambahan biaya, foto struk cetak EDC, atau foto fisik plakat QRIS beserta nama merchant yang tertera di lokasi.',
  },
  {
    id: 'faq-4',
    question:
      'Apakah semua biaya tambahan (surcharge) dilarang oleh Bank Indonesia?',
    answer:
      'Ya, Bank Indonesia secara tegas melarang merchant untuk membebankan tambahan biaya (surcharge) kepada konsumen yang bertransaksi menggunakan QRIS. Merchant harus menanggung biaya MDR (Merchant Discount Rate), bukan membebankannya ke pembeli.',
  },
  {
    id: 'faq-5',
    question: 'Bagaimana cara melacak status laporan?',
    answer:
      'Setelah Anda berhasil mengirimkan laporan, Anda akan mendapatkan ID Laporan unik (Ticket ID) berupa kode alfanumerik. Simpan ID tersebut dan gunakan menu "Status" di website SIRIS untuk melihat apakah laporan Anda sedang ditinjau, diverifikasi, atau sudah diselesaikan.',
  },
  {
    id: 'faq-6',
    question: 'Apakah saya dapat melapor tanpa membuat akun?',
    answer:
      'Tentu. Anda dapat menggunakan fitur pelaporan tanpa akun dengan memilih opsi "Lapor Anonim" di halaman pelaporan. Namun, pastikan Anda mencatat dan menyimpan ID Laporan Anda karena itu satu-satunya cara untuk melacak statusnya nanti.',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering data berdasarkan input pencarian
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const lowerQuery = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Hero Section (Solid Blue Background) */}
      <section className="bg-[#0369A1] pt-16 pb-24 px-6 relative w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-[#E0F2FE] text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Punya pertanyaan tentang pelaporan pelanggaran QRIS? Kami siap
            membantu.
          </p>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto shadow-xl rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari topik bantuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 rounded-xl bg-white text-slate-900 border-none text-base outline-none focus-visible:ring-4 focus-visible:ring-blue-400/30 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content (Grid) */}
      <section className="max-w-[1100px] mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Accordion FAQ (col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border-slate-100 py-2"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-slate-800 hover:text-[#0369A1] transition-colors [&[data-state=open]]:text-[#0369A1]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-base leading-relaxed pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>Tidak ada hasil yang ditemukan untuk "{searchQuery}".</p>
                <p className="text-sm mt-2">Coba gunakan kata kunci lain.</p>
              </div>
            )}
          </div>

          {/* Right Column: Contact Cards (col-span-1) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email Card */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-[#E0F2FE] transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-[#E0F2FE] p-3 rounded-xl flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-[#0369A1]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:pengaduan@siris.go.id"
                    className="text-[#0369A1] font-medium hover:underline inline-block mb-3"
                  >
                    pengaduan@siris.go.id
                  </a>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Tim kami akan merespons laporan Anda dalam waktu maksimal
                    1x24 jam.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Call Center Card */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-[#E0F2FE] transition-colors">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-[#E0F2FE] p-3 rounded-xl flex-shrink-0 mt-1">
                  <PhoneCall className="h-6 w-6 text-[#0369A1]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    Call Center
                  </h3>
                  <a
                    href="tel:131"
                    className="text-[#0369A1] font-bold text-xl hover:underline inline-block mb-3"
                  >
                    131 (BICARA)
                  </a>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Senin - Jumat <br /> 08.00 - 16.00 WIB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* PDF Guide Card (Dark Theme) */}
            <Card className="bg-slate-900 text-white border-transparent shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Butuh Panduan Cepat?</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Unduh panduan resmi langkah pelaporan untuk memudahkan Anda.
                </p>
                <a
                  href="/panduan-pelaporan-siris.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[#38BDF8] font-semibold hover:text-[#7DD3FC] transition-colors"
                >
                  Unduh PDF
                  <Download className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
