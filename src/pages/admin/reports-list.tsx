import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { fetchApi } from '@/lib/api';
import {
  Search,
  Download,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportRow {
  id: string;
  ticketId: string;
  violationCategory: string;
  merchantName: string;
  merchantCity: string | null;
  status: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ReportsListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const reportsRes = await fetchApi<{
          success: boolean;
          data: ReportRow[];
          pagination: PaginationData;
        }>(
          `/api/reports?page=${page}&limit=10&status=${statusFilter}&search=${searchQuery}`
        );
        if (reportsRes.success) {
          setReports(reportsRes.data);
          setPagination(reportsRes.pagination);
        }
      } catch (err) {
        console.error('Failed to load reports queue:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [page, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = [
      'ID Laporan',
      'Merchant',
      'Kategori',
      'Kota',
      'Status',
      'Tanggal',
    ];
    const rows = reports.map((r) => [
      r.ticketId,
      r.merchantName,
      r.violationCategory,
      r.merchantCity || '-',
      r.status,
      new Date(r.createdAt).toLocaleDateString('id-ID'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((e) => e.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SIRIS_semua_laporan_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            Pending
          </span>
        );
      case 'in_review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#9333EA] border border-[#E9D5FF]">
            Investigasi
          </span>
        );
      case 'verified':
      case 'resolved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]">
            Valid
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
      {/* Content Area */}
      <div className="flex-grow p-8 space-y-6 max-w-[1600px] w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Antrean Laporan Masuk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Seluruh laporan aduan dari masyarakat terkait surcharge QRIS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
              <input
                type="text"
                aria-label="Cari merchant atau tiket"
                placeholder="Cari merchant atau tiket..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-450 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Status Selector */}
            <div className="relative">
              <select
                aria-label="Filter status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-sky-500 font-medium"
              >
                <option value="">Semua Status</option>
                <option value="submitted">Pending</option>
                <option value="in_review">Investigasi</option>
                <option value="verified">Valid</option>
                <option value="resolved">Selesai</option>
              </select>
            </div>

            <Button
              onClick={handleExportCSV}
              className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl flex items-center gap-1.5 text-xs py-2 h-auto font-bold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor CSV
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            {loading && reports.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                <p className="text-slate-500 text-xs font-semibold">
                  Mengambil antrean laporan...
                </p>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-700">
                  Belum Ada Laporan
                </h4>
                <p className="text-xs text-slate-400">
                  Tidak ada data aduan yang cocok dengan filter atau kata kunci
                  Anda.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#074770] text-white font-bold uppercase tracking-wider">
                    <th className="p-4 text-xs font-bold">ID Laporan</th>
                    <th className="p-4 text-xs font-bold">Merchant</th>
                    <th className="p-4 text-xs font-bold">Kategori</th>
                    <th className="p-4 text-xs font-bold">Lokasi</th>
                    <th className="p-4 text-xs font-bold">Status</th>
                    <th className="p-4 text-xs font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 transition-all bg-white"
                    >
                      <td className="p-4 font-bold text-slate-900">
                        <div>#{report.ticketId}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {new Date(report.createdAt).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-900 font-bold text-sm">
                        {report.merchantName}
                      </td>
                      <td className="p-4 text-slate-700 font-semibold">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          {report.violationCategory}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {report.merchantCity || '-'}
                      </td>
                      <td className="p-4">{getStatusBadge(report.status)}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/reports/${report.id}`)
                          }
                          className="text-[#0369A1] hover:text-[#0284c7] hover:bg-sky-55 rounded-lg p-1.5 h-auto animate-pulse-subtle"
                          aria-label={`Lihat detail laporan ${report.ticketId}`}
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Section */}
          {reports.length > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              <span>
                Menampilkan {reports.length} dari {pagination.total} data
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg p-1 h-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-bold text-slate-700 px-2 font-mono">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg p-1 h-auto"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Banner */}
      <footer className="w-full bg-[#074770] text-white py-6 mt-auto">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="space-y-1">
            <span className="block font-bold text-sm">SIRIS Admin Portal</span>
            <span className="block text-slate-300">
              © 2024 Bank Indonesia. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </span>
          </div>
          <div className="flex gap-6 text-slate-200 font-semibold">
            <a href="#kebijakan" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#syarat" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#kontak" className="hover:text-white transition-colors">
              Kontak BI 131
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
