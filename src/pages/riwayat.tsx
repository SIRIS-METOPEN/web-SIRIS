import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  ExternalLink,
  Calendar,
  Building2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { fetchApi } from '@/lib/api';

interface SavedReport {
  ticketId: string;
  merchantName: string;
  violationCategory: string;
  createdAt: string;
  status?: string;
  isFromServer?: boolean;
}

export default function RiwayatPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [loadingServer, setLoadingServer] = useState(false);

  const [reports, setReports] = useState<SavedReport[]>(() => {
    try {
      const existing = localStorage.getItem('siris_report_history');
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      console.error('Failed to parse report history:', e);
      return [];
    }
  });

  useEffect(() => {
    if (session?.user) {
      const fetchMyReports = async () => {
        setLoadingServer(true);
        try {
          const res = await fetchApi<{ success: boolean; data: SavedReport[] }>(
            '/api/reports/me'
          );
          if (res.success && res.data) {
            const serverReports: SavedReport[] = res.data.map((r) => ({
              ...r,
              isFromServer: true,
            }));

            // Merge server reports with local reports (avoiding duplicates by ticketId)
            setReports((prev) => {
              const merged = [...serverReports];
              const serverTicketIds = new Set(
                serverReports.map((r) => r.ticketId)
              );

              prev.forEach((p) => {
                if (!serverTicketIds.has(p.ticketId)) {
                  merged.push(p);
                }
              });

              // Sort newest first
              return merged.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
            });
          }
        } catch (e) {
          console.error('Failed to fetch server reports', e);
        } finally {
          setLoadingServer(false);
        }
      };
      fetchMyReports();
    }
  }, [session?.user]);

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
    if (
      window.confirm(
        'Apakah Anda yakin ingin menghapus seluruh riwayat aduan di browser ini?'
      )
    ) {
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
          Daftar pengaduan yang Anda kirimkan melalui browser ini. Klik laporan
          untuk melihat detail status investigasi.
        </p>
      </div>

      {reports.length > 0 && !loadingServer && !isSessionLoading && (
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

      {isSessionLoading || loadingServer ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">
            Menyelaraskan riwayat dengan server...
          </p>
        </div>
      ) : reports.length === 0 ? (
        <div className="border border-dashed border-border bg-card/40 rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Belum Ada Riwayat Laporan</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Anda belum pernah mengirimkan laporan aduan di browser ini, atau
            riwayat local storage Anda telah dibersihkan.
          </p>
          <Button
            onClick={() => navigate('/laporkan')}
            className="mt-2 bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl"
          >
            Buat Laporan Baru
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.ticketId}
              // oxlint-disable-next-line prefer-tag-over-role
              role="button"
              tabIndex={0}
              aria-label={`Lacak status aduan ${report.ticketId} untuk merchant ${report.merchantName}`}
              onClick={() =>
                navigate('/status', { state: { ticketId: report.ticketId } })
              }
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
                  Dikirim pada:{' '}
                  {new Date(report.createdAt).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
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

          {!session?.user ? (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-xs text-amber-800 leading-relaxed">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Catatan:</strong> Anda belum masuk. Riwayat di atas
                hanya tersimpan secara lokal di browser perangkat ini. Jika Anda
                membersihkan data/cache browser, data ini akan hilang.{' '}
                <strong>Masuk akun</strong> untuk menyimpan laporan secara
                permanen.
              </span>
            </div>
          ) : (
            <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6 text-xs text-emerald-800 leading-relaxed">
              <AlertCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Tersinkronisasi:</strong> Anda masuk sebagai{' '}
                <strong>{session.user.email}</strong>. Laporan Anda aman di
                server dan dapat diakses dari perangkat mana saja.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
