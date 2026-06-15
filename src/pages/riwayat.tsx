import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Calendar, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SavedReport {
  ticketId: string;
  merchantName: string;
  violationCategory: string;
  createdAt: string;
}

export default function RiwayatPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>(() => {
    try {
      const existing = localStorage.getItem('siris_report_history');
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      console.error('Failed to parse report history:', e);
      return [];
    }
  });

  const handleDelete = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const existing = localStorage.getItem('siris_report_history');
      if (existing) {
        const history: SavedReport[] = JSON.parse(existing);
        const filtered = history.filter((r) => r.ticketId !== ticketId);
        localStorage.setItem('siris_report_history', JSON.stringify(filtered));
        setReports(filtered);
        toast.success('Laporan berhasil dihapus dari riwayat lokal');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus laporan');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat aduan di browser ini?')) {
      localStorage.removeItem('siris_report_history');
      setReports([]);
      toast.success('Semua riwayat berhasil dibersihkan');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh] flex flex-col justify-start">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 to-indigo-800 dark:from-sky-400 dark:to-indigo-300 bg-clip-text text-transparent">
          Riwayat Laporan Anda
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Daftar pengaduan yang Anda kirimkan melalui browser ini. Klik laporan untuk melihat detail status investigasi.
        </p>
      </div>

      {reports.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl"
          >
            Bersihkan Semua
          </Button>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="border border-dashed border-border bg-card/40 rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Belum Ada Riwayat Laporan</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Anda belum pernah mengirimkan laporan aduan di browser ini, atau riwayat local storage Anda telah dibersihkan.
          </p>
          <Button onClick={() => navigate('/laporkan')} className="mt-2 bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl">
            Buat Laporan Baru
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.ticketId}
              role="button"
              tabIndex={0}
              aria-label={`Lacak status aduan ${report.ticketId} untuk merchant ${report.merchantName}`}
              onClick={() => navigate('/status', { state: { ticketId: report.ticketId } })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/status', { state: { ticketId: report.ticketId } });
                }
              }}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#0369A1] hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 tracking-wider font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                    {report.ticketId}
                  </span>
                  <span className="text-xs font-medium text-[#0369A1] bg-[#E0F2FE] px-2.5 py-1 rounded-md">
                    {report.violationCategory || 'Surcharge QRIS'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {report.merchantName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Dikirim pada: {new Date(report.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(report.ticketId, e)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  title="Hapus dari riwayat browser"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-200 text-[#0369A1] hover:bg-sky-50 hover:text-[#0369A1] flex items-center gap-1.5"
                >
                  Pantau
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-xs text-amber-800 leading-relaxed">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Catatan:</strong> Riwayat di atas hanya tersimpan secara lokal di browser perangkat ini. Jika Anda membersihkan data/cache browser atau menggunakan perangkat/browser lain, data ini akan hilang.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
