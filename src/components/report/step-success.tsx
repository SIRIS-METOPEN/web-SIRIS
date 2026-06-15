import { CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepSuccessProps {
  ticketId: string;
  onCopy: () => void;
  onHomeClick: () => void;
  onTrackClick: () => void;
}

export function StepSuccess({
  ticketId,
  onCopy,
  onHomeClick,
  onTrackClick,
}: StepSuccessProps) {
  return (
    <div className="max-w-[700px] mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-8 md:p-12 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-600 mb-6 animate-bounce">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
        Laporan Berhasil Terkirim!
      </h1>
      <p className="text-slate-600 leading-relaxed max-w-lg mx-auto mb-10">
        Terima kasih telah berkontribusi dalam menjaga ekosistem QRIS yang
        sehat. Laporan Anda telah masuk ke sistem kami untuk divalidasi tim
        investigasi Bank Indonesia.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block mb-2">
          Kode Tracking Laporan Anda
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl md:text-3xl font-black text-[#0369A1] tracking-wider font-mono">
            {ticketId}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            aria-label="Salin Kode Tracking"
            className="text-[#0369A1] hover:bg-slate-200"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="text-left bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 max-w-xl mx-auto flex gap-3">
        <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-1">
            Penting: Simpan Kode Tracking Anda!
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Sistem telah menyimpan tiket ini secara otomatis ke halaman{' '}
            <strong>Riwayat Laporan</strong> di browser ini. Namun, jika Anda
            membersihkan data browser atau menggunakan perangkat lain, riwayat
            tersebut akan terhapus. Harap salin dan simpan kode tracking di atas
            secara mandiri.
          </p>
        </div>
      </div>

      <div className="text-left bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 max-w-xl mx-auto">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-[#0369A1]" />
          Langkah Selanjutnya
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0369A1] text-white text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                Verifikasi Dokumen
              </h4>
              <p className="text-xs text-slate-600">
                Estimasi waktu: 1-2 hari kerja untuk peninjauan awal oleh tim
                analis.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0369A1] text-white text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                Proses Investigasi
              </h4>
              <p className="text-xs text-slate-600">
                Estimasi waktu: 3-5 hari kerja jika diperlukan validasi lebih
                lanjut ke Merchant/PJP terkait.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onHomeClick}
          className="px-6 py-5 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Kembali ke Beranda
        </Button>
        <Button
          onClick={onTrackClick}
          className="px-6 py-5 rounded-xl font-semibold bg-[#0369A1] hover:bg-[#0284c7] text-white transition-colors"
        >
          Lacak Status Laporan
        </Button>
      </div>
    </div>
  );
}
