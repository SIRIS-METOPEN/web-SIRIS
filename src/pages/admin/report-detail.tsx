import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchApi } from '@/lib/api';
import {
  ArrowLeft,
  Building2,
  FileDown,
  Clock,
  Save,
  Loader2,
  FileText,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapView } from '@/components/ui/map-view';

interface Merchant {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface Reporter {
  name: string | null;
  phone: string | null;
  email: string | null;
  isAnonymous: boolean;
}

interface Evidence {
  id: string;
  fileUrl: string;
  fileType: string | null;
  fileName: string | null;
}

interface HistoryLog {
  id: string;
  oldStatus: string;
  newStatus: string;
  notes: string | null;
  createdAt: string;
  actorName: string;
}

interface ReportDetail {
  id: string;
  ticketId: string;
  violationDate: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNotes: string | null;
  merchant: Merchant;
  reporter: Reporter;
  evidences: Evidence[];
  history: HistoryLog[];
}

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [statusInput, setStatusInput] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');

  const [actionLoading, setActionLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetchApi<{ success: boolean; data: ReportDetail }>(
          `/api/reports/${id}`
        );
        if (res.success) {
          setReport(res.data);
          setStatusInput(res.data.status);
          setInternalNotes(res.data.adminNotes || '');
        }
      } catch (err) {
        console.error('Failed to load report detail:', err);
        toast.error('Laporan tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id]);

  const handleUpdateStatus = async (targetStatus?: string) => {
    const nextStatus = targetStatus || statusInput;
    if (!id || !nextStatus) return;

    setActionLoading(true);
    try {
      const res = await fetchApi<{
        success: boolean;
        data: { status: string; updatedAt: string };
      }>(`/api/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: nextStatus,
          notes: statusNotes || `Status diubah ke ${nextStatus} oleh Admin`,
        }),
      });

      if (res.success) {
        toast.success(`Status berhasil diubah ke ${nextStatus}`);
        setStatusNotes('');
        // Reload details to update logs
        const detailRes = await fetchApi<{
          success: boolean;
          data: ReportDetail;
        }>(`/api/reports/${id}`);
        if (detailRes.success) {
          setReport(detailRes.data);
          setStatusInput(detailRes.data.status);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!id) return;
    setNotesLoading(true);
    try {
      const res = await fetchApi<{
        success: boolean;
        data: { adminNotes: string | null };
      }>(`/api/reports/${id}/internal-notes`, {
        method: 'POST',
        body: JSON.stringify({ notes: internalNotes }),
      });

      if (res.success) {
        toast.success('Catatan internal disimpan');
        if (report) {
          setReport({ ...report, adminNotes: res.data.adminNotes });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan catatan');
    } finally {
      setNotesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4 bg-[#F8FAFC] min-h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse">
          Memuat Detail Investigasi...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-32 text-center space-y-4 bg-[#F8FAFC] min-h-[80vh]">
        <h3 className="text-xl font-bold text-slate-700">
          Laporan Tidak Ditemukan
        </h3>
        <Button
          onClick={() => navigate('/admin')}
          className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl"
        >
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return (
          <span className="px-3 py-1 text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] rounded-md uppercase tracking-wider">
            PENDING VERIFIKASI
          </span>
        );
      case 'in_review':
        return (
          <span className="px-3 py-1 text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] rounded-md uppercase tracking-wider">
            SEDANG DIPROSES
          </span>
        );
      case 'verified':
        return (
          <span className="px-3 py-1 text-xs font-bold bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-md uppercase tracking-wider">
            TERVERIFIKASI
          </span>
        );
      case 'resolved':
        return (
          <span className="px-3 py-1 text-xs font-bold bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-md uppercase tracking-wider">
            SELESAI
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-md uppercase tracking-wider">
            DITOLAK
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-650 border border-slate-200 rounded-md uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] p-8 space-y-6">
      {/* Title & Info Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Laporan {report.ticketId}
            </h2>
            {getStatusBadge(report.status)}
          </div>
          <p className="text-xs text-slate-405 font-semibold">
            Dikirim oleh:{' '}
            <span className="text-slate-600 font-bold">
              {report.reporter.isAnonymous
                ? 'Anonim'
                : report.reporter.name || 'User'}
            </span>{' '}
            -{' '}
            {new Date(report.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            WIB
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus('rejected')}
            disabled={actionLoading}
            className="border-red-200 text-red-650 hover:bg-red-50 rounded-xl font-bold text-xs px-4 py-2.5 h-auto"
          >
            Tolak Laporan
          </Button>

          <Button
            onClick={() => handleUpdateStatus('verified')}
            disabled={actionLoading}
            className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl font-bold text-xs px-4 py-2.5 h-auto shadow-sm"
          >
            Verifikasi Laporan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Forms & Relational Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Merchant Card */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-5 text-slate-800">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0369A1]" />
              Informasi Merchant
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs border-t border-slate-100 pt-4">
              <div>
                <span className="text-slate-450 font-bold block mb-1">
                  Nama Merchant
                </span>
                <span className="text-slate-850 font-bold text-sm">
                  {report.merchant.name}
                </span>
              </div>

              <div>
                <span className="text-slate-450 font-bold block mb-1">
                  Kota
                </span>
                <span className="text-slate-850 font-bold text-sm">
                  {report.merchant.city || '-'}
                </span>
              </div>

              <div>
                <span className="text-slate-450 font-bold block mb-1">
                  Kategori Pelanggaran
                </span>
                <span className="text-[#0369A1] font-bold text-sm bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block">
                  Biaya Surcharge QRIS
                </span>
              </div>

              <div>
                <span className="text-slate-450 font-bold block mb-1">
                  Tanggal Transaksi
                </span>
                <span className="text-slate-850 font-bold text-sm">
                  {new Date(report.violationDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Financial Details Gray Box */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-450 font-bold block mb-0.5">
                  Rincian Finansial
                </span>
                <span className="text-slate-700 font-bold text-sm">
                  Nilai Transaksi
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-850 font-bold block text-sm">
                  Rp 15.000
                </span>
                <span className="text-red-500 font-bold text-xs">
                  Biaya Tambahan (Illegal): Rp 3.000 (33%)
                </span>
              </div>
            </div>
          </div>

          {/* Kronologi Card */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 text-slate-800">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0369A1]" />
              Kronologi Kejadian
            </h3>

            <div className="border-t border-slate-100 pt-4">
              <div className="border-l-4 border-[#0369A1] pl-4 py-1 bg-slate-50/50 p-4 rounded-r-xl text-slate-600 leading-relaxed text-xs">
                {report.description}
              </div>
            </div>
          </div>

          {/* Bukti Transaksi Card */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 text-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <FileDown className="w-5 h-5 text-[#0369A1]" />
                Bukti Transaksi
              </h3>
              <span className="text-[10px] font-bold text-[#0369A1] cursor-pointer hover:underline">
                Unduh Semua
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.evidences.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  Tidak ada berkas bukti diunggah.
                </p>
              ) : (
                report.evidences.map((evidence, i) => (
                  <div
                    key={evidence.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center gap-4 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {evidence.fileName || `bukti-struk-${i + 1}.jpg`}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {evidence.fileType || '1.2 MB'}
                      </p>
                    </div>

                    <a
                      href={evidence.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[#0369A1] transition-all"
                    >
                      <FileDown className="w-4.5 h-4.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Status & Map Actions */}
        <div className="space-y-6">
          {/* Status & Progres Widget */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-5 text-slate-800">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0369A1]" />
              Status & Progres
            </h3>

            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex gap-2">
                <select
                  aria-label="Pilih Status"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-sky-500 font-medium"
                >
                  <option value="submitted">Investigasi</option>
                  <option value="in_review">Sedang Diproses</option>
                  <option value="verified">Valid</option>
                  <option value="resolved">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
                <Button
                  onClick={() => handleUpdateStatus()}
                  disabled={actionLoading}
                  className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl text-xs font-bold px-4 py-2 h-auto"
                >
                  Update
                </Button>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4 pt-2">
                {report.history.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    Belum ada riwayat aktivitas log.
                  </div>
                ) : (
                  <div className="relative border-l border-slate-200 ml-2.5 pl-4 space-y-4">
                    {report.history.map((log) => (
                      <div key={log.id} className="relative space-y-0.5">
                        {/* Timeline dot */}
                        <span className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#0369A1] border border-white shadow"></span>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                          <span>{log.actorName || 'System'}</span>
                          <span>
                            {new Date(log.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 font-bold">
                          {log.newStatus === 'submitted'
                            ? 'Laporan Diterima'
                            : log.newStatus === 'in_review'
                              ? 'Verifikasi Awal'
                              : 'Investigasi Lapangan'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lokasi Merchant Widget */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 text-slate-800">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0369A1]" />
              Lokasi Merchant
            </h3>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="h-40 rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
                <MapView
                  center={[
                    report.merchant.latitude || -6.3728,
                    report.merchant.longitude || 106.8271,
                  ]}
                  zoom={14}
                  markers={[
                    {
                      id: report.merchant.id,
                      latitude: report.merchant.latitude || -6.3728,
                      longitude: report.merchant.longitude || 106.8271,
                      popupText: report.merchant.name,
                    },
                  ]}
                  height="160px"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold text-center font-mono">
                {report.merchant.latitude || '-6.3728'},{' '}
                {report.merchant.longitude || '106.8271'}
              </p>
            </div>
          </div>

          {/* Catatan Internal Admin Widget */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 text-slate-800">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Save className="w-5 h-5 text-[#0369A1]" />
              Catatan Internal Admin
            </h3>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label htmlFor="internal-notes" className="sr-only">
                Catatan Internal Admin
              </label>
              <textarea
                id="internal-notes"
                aria-label="Catatan Internal Admin"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Masukkan catatan rahasia untuk tim investigasi..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 min-h-[100px] shadow-sm font-medium"
              ></textarea>

              <Button
                onClick={handleSaveInternalNotes}
                disabled={notesLoading}
                className="w-full bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl text-xs font-semibold py-2 h-auto"
              >
                {notesLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                )}
                Simpan Catatan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/reports')}
          className="text-[#0369A1] hover:text-[#0284c7] hover:bg-sky-50 rounded-xl text-xs font-bold py-2 h-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Laporan
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus('rejected')}
            disabled={actionLoading}
            className="border-red-200 text-red-650 hover:bg-red-50 rounded-xl font-bold text-xs px-4 py-2.5 h-auto"
          >
            Tolak Laporan
          </Button>

          <Button
            onClick={() => handleUpdateStatus('verified')}
            disabled={actionLoading}
            className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl font-bold text-xs px-4 py-2.5 h-auto shadow-sm"
          >
            Verifikasi & Teruskan
          </Button>
        </div>
      </div>
    </div>
  );
}
