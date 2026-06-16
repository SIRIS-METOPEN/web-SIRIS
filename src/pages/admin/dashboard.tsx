import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { fetchApi } from '@/lib/api';
import {
  FileText,
  Clock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapView } from '@/components/ui/map-view';

interface Metric {
  value: number;
  trend: number;
}

interface DashboardMetrics {
  totalReports: Metric;
  pendingVerification: Metric;
  investigationActive: Metric;
  resolvedReports: Metric;
}

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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Metrics
        const metricsRes = await fetchApi<{
          success: boolean;
          data: DashboardMetrics;
        }>('/api/dashboard/metrics');
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
        }

        // Fetch Reports
        const reportsRes = await fetchApi<{
          success: boolean;
          data: ReportRow[];
          pagination: PaginationData;
        }>(`/api/reports?page=${page}&limit=5&status=${statusFilter}&search=`);
        if (reportsRes.success) {
          setReports(reportsRes.data);
          setPagination(reportsRes.pagination);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [page, statusFilter]);

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
    link.setAttribute('download', `SIRIS_laporan_export_${Date.now()}.csv`);
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

  // Helper to render stats trend indicators
  const renderTrend = (trend: number) => {
    const isPositive = trend > 0;
    const isZero = trend === 0;

    if (isZero) {
      return (
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          0% —
        </span>
      );
    }

    return (
      <span
        className={`text-xs font-bold flex items-center gap-0.5 ${
          isPositive ? 'text-emerald-500' : 'text-rose-500'
        }`}
      >
        {isPositive ? `+${trend}%` : `${trend}%`}
        <TrendingUp
          className={`w-3 h-3 ml-0.5 ${isPositive ? 'rotate-0' : 'rotate-180'}`}
        />
      </span>
    );
  };

  const markers = reports
    .filter((r) => r.id && r.merchantName)
    .map((r) => {
      const cityLower = r.merchantCity?.toLowerCase() || '';
      let lat = -6.2088;
      let lng = 106.8456;
      if (cityLower.includes('surabaya')) {
        lat = -7.2575;
        lng = 112.7521;
      } else if (cityLower.includes('bandung')) {
        lat = -6.9175;
        lng = 107.6191;
      } else if (cityLower.includes('depok')) {
        lat = -6.4025;
        lng = 106.7942;
      } else if (cityLower.includes('medan')) {
        lat = 3.5952;
        lng = 98.6722;
      } else if (cityLower.includes('semarang')) {
        lat = -6.9932;
        lng = 110.4203;
      }
      return {
        id: r.id,
        latitude: lat,
        longitude: lng,
        popupText: `${r.merchantName} (${r.merchantCity || 'Unknown'}): ${r.violationCategory}`,
      };
    });

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
      {/* Content Area */}
      <div className="flex-grow p-8 space-y-8 max-w-[1600px] w-full mx-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && !metrics ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 p-6 rounded-2xl animate-pulse space-y-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                <div className="h-8 bg-slate-100 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              {/* Metric 1 */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-sky-55 border border-sky-100 flex items-center justify-center text-[#0369A1]">
                    <FileText className="w-5 h-5" />
                  </div>
                  {metrics && renderTrend(metrics.totalReports.trend)}
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Total Laporan
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                    {metrics?.totalReports.value.toLocaleString('id-ID') || 0}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Data 30 hari terakhir
                  </span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-55 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  {metrics && renderTrend(metrics.pendingVerification.trend)}
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Pending Verifikasi
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-amber-600 mt-1">
                    {metrics?.pendingVerification.value.toLocaleString(
                      'id-ID'
                    ) || 0}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1 font-semibold text-amber-600/70">
                    Membutuhkan atensi segera
                  </span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-55 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Search className="w-5 h-5" />
                  </div>
                  {metrics && renderTrend(metrics.investigationActive.trend)}
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Investigasi Aktif
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                    {metrics?.investigationActive.value.toLocaleString(
                      'id-ID'
                    ) || 0}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Sedang dalam proses tinjau
                  </span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-55 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {metrics && renderTrend(metrics.resolvedReports.trend)}
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Laporan Selesai
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-[#22C55E] mt-1">
                    {metrics?.resolvedReports.value.toLocaleString('id-ID') ||
                      0}
                  </h3>
                  <span className="text-[10px] text-[#22C55E] block mt-1 font-semibold">
                    Terselesaikan secara tuntas
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Map Widget and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spot Maps Hotspot */}
          <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[460px]">
            <div>
              <h3 className="text-md font-bold text-[#0F172A]">
                Titik Pelanggaran
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Peta persebaran hotspots nasional.
              </p>
            </div>

            <div className="flex-1 my-5 rounded-xl overflow-hidden border border-slate-200 min-h-[280px] z-0 relative">
              <MapView
                center={[-2.5489, 118.0149]}
                zoom={5}
                markers={markers}
                height="280px"
              />
            </div>

            {/* Region Progress List */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
                      Jakarta Pusat
                    </span>
                    <span className="text-slate-500 font-bold">
                      324 Laporan
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 block"></span>
                      Surabaya Timur
                    </span>
                    <span className="text-slate-500 font-bold">
                      186 Laporan
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0369A1] block"></span>
                      Bandung Barat
                    </span>
                    <span className="text-slate-500 font-bold">
                      112 Laporan
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0369A1] h-full rounded-full"
                      style={{ width: '28%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <Button
                  variant="outline"
                  className="w-full max-w-xs mx-auto border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold py-2 h-auto"
                >
                  Lihat Analisis Wilayah
                </Button>
              </div>
            </div>
          </div>

          {/* Kategori Teratas */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-md font-bold text-slate-800">
                Kategori Teratas
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aktivitas aduan terbanyak berdasarkan kategori.
              </p>
            </div>

            <div className="space-y-6 my-6 flex-1 flex flex-col justify-center">
              {/* Category 1 */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-150 flex items-center justify-center text-slate-600 shadow-sm">
                  <FileText className="w-5 h-5 text-[#0369A1]" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Penyalahgunaan QRIS
                    </span>
                    <span className="font-mono text-sky-700 font-bold">
                      42%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0369A1] h-full rounded-full"
                      style={{ width: '42%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category 2 */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-150 flex items-center justify-center text-slate-600 shadow-sm">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Pungutan Liar
                    </span>
                    <span className="font-mono text-sky-700 font-bold">
                      28%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0369A1] h-full rounded-full"
                      style={{ width: '28%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Berdasarkan data audit bulanan validator BI
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Table Section */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Laporan Terbaru
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Antrean laporan masuk yang menunggu verifikasi petugas.
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  aria-label="Filter status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                variant="outline"
                onClick={() => setStatusFilter('')}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-1 text-xs py-2 h-auto"
              >
                Filter
              </Button>

              <Button
                onClick={handleExportCSV}
                className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl flex items-center gap-1.5 text-xs py-2 h-auto font-bold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor CSV
              </Button>
            </div>
          </div>

          {/* Table Render */}
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
                  Tidak ada data aduan yang cocok dengan filter Anda.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#074770] text-white font-bold uppercase tracking-wider">
                    <th className="p-4 text-xs font-bold">ID Laporan</th>
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
                          className="text-[#0369A1] hover:text-[#0284c7] hover:bg-sky-55 rounded-lg p-1.5 h-auto"
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
