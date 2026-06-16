import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar,
  MapPin,
  FileDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StatistikPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('01 Jan - 29 Mei 2026');
  const [selectedLocation, setSelectedLocation] = useState('Semua Provinsi');

  const merchantStats = [
    {
      name: 'Warung Bu Tini',
      city: 'Jkt Selatan',
      count: 5,
      status: 'INVESTIGASI',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      name: 'Toko Kelontong XYZ',
      city: 'Depok',
      count: 3,
      status: 'DIAWASI',
      statusColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      name: 'Cafe Kopi N.',
      city: 'Bandung',
      count: 2,
      status: 'CLEAR',
      statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
      {/* Content */}
      <div className="flex-grow p-8 space-y-8 max-w-[1600px] w-full mx-auto">
        {/* Header Title & PDF/CSV buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Statistik & Monitoring
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analisis tren penyalahgunaan QRIS dan performa validator.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2 px-4 rounded-xl h-auto flex items-center gap-1.5 shadow-sm"
            >
              <FileDown className="w-4 h-4 text-slate-450" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2 px-4 rounded-xl h-auto flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-450" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              aria-label="Filter Rentang Tanggal"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none w-44"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter Provinsi"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none outline-none"
            >
              <option value="Semua Provinsi">Semua Provinsi</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Timur">Jawa Timur</option>
            </select>
          </div>

          <Button className="bg-[#0369A1] hover:bg-[#0284c7] text-white rounded-xl text-xs font-bold px-5 py-2 h-auto shadow-sm">
            Terapkan Filter
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Total Laporan
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0369A1]">
                <FileDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900 leading-none">
                142
              </h3>
              <span className="text-[10px] text-emerald-500 font-bold block mt-1.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +12% dari bulan lalu
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Terselesaikan
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-slate-900 leading-none">
                  96
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  67%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                Dalam durasi &lt; 48 jam
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Nominal Pelanggaran
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">
                Rp 142.000
              </h3>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                Potensi kerugian estimasi
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Merchant Berulang
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900 leading-none">
                8
              </h3>
              <span className="text-[10px] text-amber-600 font-bold block mt-1.5">
                Butuh atensi khusus (High Risk)
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trend Chart (2/3 width) */}
          <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="text-md font-bold text-slate-800">
                Tren Laporan Jan–Mei 2026
              </h3>
              <p className="text-xs text-slate-400">
                Frekuensi masuk aduan per bulan.
              </p>
            </div>

            <div className="flex-1 my-5 flex items-end relative min-h-[200px]">
              <svg
                className="w-full h-full text-[#0369A1]"
                viewBox="0 0 600 160"
              >
                <path
                  d="M 50 120 L 175 100 L 300 130 L 425 40 L 550 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots */}
                <circle
                  cx="50"
                  cy="120"
                  r="5"
                  fill="#0369A1"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="175"
                  cy="100"
                  r="5"
                  fill="#0369A1"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="300"
                  cy="130"
                  r="5"
                  fill="#0369A1"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="425"
                  cy="40"
                  r="7"
                  fill="#0369A1"
                  stroke="white"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <circle
                  cx="550"
                  cy="20"
                  r="5"
                  fill="#0369A1"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              {/* Month Legends */}
              <div className="absolute bottom-0 inset-x-0 flex justify-between px-6 text-[10px] text-slate-450 font-bold">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>Mei</span>
              </div>
            </div>
          </div>

          {/* Geo Distribution (1/3 width) */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-slate-800">
                Distribusi Geografis (Top 5)
              </h3>
              <p className="text-xs text-slate-400">
                Kota pelaporan tertinggi.
              </p>
            </div>

            <div className="space-y-4 my-4 flex-grow flex flex-col justify-center">
              {[
                { name: 'Jkt Selatan', count: 38, width: '90%' },
                { name: 'Depok', count: 27, width: '68%' },
                { name: 'Bandung', count: 21, width: '52%' },
                { name: 'Surabaya', count: 18, width: '42%' },
                { name: 'Medan', count: 12, width: '28%' },
              ].map((city) => (
                <div key={city.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{city.name}</span>
                    <span className="font-bold text-slate-800">
                      {city.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#074770] h-full rounded-full"
                      style={{ width: city.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Violations Category Chart */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-md font-bold text-slate-800">
                Kategori Pelanggaran
              </h3>
              <p className="text-xs text-slate-400">
                Pembagian tipe pelanggaran.
              </p>
            </div>

            <div className="flex-grow flex items-center justify-center my-4 relative">
              {/* Donut chart mockup */}
              <div className="w-28 h-28 rounded-full border-[10px] border-[#0369A1] flex items-center justify-center border-t-amber-400 border-r-slate-200">
                <div className="text-center">
                  <span className="block text-[14px] font-black text-slate-800 leading-none">
                    100%
                  </span>
                  <span className="block text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">
                    TOTAL
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0369A1] block"></span>
                  MDR Surcharge
                </span>
                <span className="font-bold text-slate-800">72%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
                  Biaya Admin
                </span>
                <span className="font-bold text-slate-800">18%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 block"></span>
                  Lainnya
                </span>
                <span className="font-bold text-slate-800">10%</span>
              </div>
            </div>
          </div>

          {/* Average Resolution Time */}
          <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-md font-bold text-slate-800">
                    Rata-rata Waktu Penyelesaian (hari)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Distribusi wilayah kepulauan.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-450 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-sky-200 block"></span>
                    TERVERIFIKASI
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-[#0369A1] block"></span>
                    TERSELESAIKAN
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-grow flex items-end justify-between px-6 pt-10 pb-2 relative h-[180px] border-b border-slate-150">
              {/* Simulation bar groups */}
              {[
                { label: 'Jawa', ver: 45, res: 78 },
                { label: 'Sumatera', ver: 60, res: 90 },
                { label: 'Sulawesi', ver: 35, res: 55 },
                { label: 'Kalimantan', ver: 50, res: 70 },
                { label: 'Papua', ver: 80, res: 110 },
              ].map((group) => (
                <div
                  key={group.label}
                  className="flex flex-col items-center gap-1.5 w-16"
                >
                  <div className="flex items-end gap-1.5">
                    <div
                      className="bg-sky-200 rounded-t w-3.5"
                      style={{ height: `${group.ver}px` }}
                    ></div>
                    <div
                      className="bg-[#0369A1] rounded-t w-3.5"
                      style={{ height: `${group.res}px` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-450">
                    {group.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Merchant dengan Laporan Terbanyak Table */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-slate-800">
              Merchant dengan Laporan Terbanyak
            </h3>
            <button
              onClick={() => navigate('/admin/reports')}
              className="text-xs font-bold text-[#0369A1] hover:text-[#0284c7]"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#074770] text-white font-bold uppercase tracking-wider">
                  <th className="p-4">Nama Merchant</th>
                  <th className="p-4">Kota</th>
                  <th className="p-4">Jumlah Laporan</th>
                  <th className="p-4">Status Merchant</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {merchantStats.map((item) => (
                  <tr
                    key={item.name}
                    className="hover:bg-slate-50 transition-all bg-white"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-[#0369A1] text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {item.city}
                    </td>
                    <td className="p-4 font-bold text-red-600 text-sm">
                      {item.count}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold border rounded-full ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate('/admin/reports')}
                        className="text-[#0369A1] hover:text-[#0284c7] font-bold text-xs"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
