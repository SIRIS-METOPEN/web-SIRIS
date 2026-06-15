import React, { useState, useCallback, useEffect, useTransition } from 'react';
import {
  Search,
  Loader2,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileCheck,
  Ban,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { fetchApi } from '../lib/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';

interface ReportDetails {
  ticketId: string;
  violationDate: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string | null;
  merchantName: string;
  merchantCity?: string | null;
  merchantAddress?: string | null;
  evidenceUrl?: string | null;
}

// Map database status string to display format and color classes
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    colorClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  submitted: {
    label: 'Laporan Diterima',
    description: 'Aduan berhasil disimpan dan menunggu antrean peninjauan.',
    colorClass:
      'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300',
    icon: FileText,
  },
  in_review: {
    label: 'Dalam Peninjauan',
    description:
      'Tim investigator sedang meninjau dokumen & kelengkapan bukti.',
    colorClass:
      'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300',
    icon: Loader2,
  },
  verified: {
    label: 'Terverifikasi / Investigasi',
    description:
      'Bukti dinyatakan valid, pemeriksaan lapangan sedang dilakukan.',
    colorClass:
      'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300',
    icon: ShieldCheck,
  },
  resolved: {
    label: 'Selesai / Ditindak',
    description:
      'Investigasi rampung. Sanksi atau edukasi telah diterapkan pada merchant.',
    colorClass:
      'bg-green-500/10 border-green-500 text-green-700 dark:text-green-300',
    icon: FileCheck,
  },
  rejected: {
    label: 'Ditolak',
    description:
      'Aduan ditolak karena bukti tidak memadai atau tidak ada indikasi surcharge.',
    colorClass: 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-300',
    icon: Ban,
  },
};

const ORDERED_STATUSES = ['submitted', 'in_review', 'verified', 'resolved'];

export default function StatusTrackerPage() {
  const location = useLocation();
  const state = location.state as { ticketId?: string } | null;
  const [ticketQuery, setTicketQuery] = useState(state?.ticketId || '');
  const [reportData, setReportData] = useState<ReportDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await fetchApi<{ success: boolean; data: ReportDetails }>(
          `/api/reports/${query.trim()}`
        );
        if (res.success && res.data) {
          setReportData(res.data);
        } else {
          setErrorMsg(
            'Laporan tidak ditemukan. Silakan periksa kembali Ticket ID Anda.'
          );
          setReportData(null);
        }
      } catch (err: unknown) {
        console.error(err);
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Gagal memuat detail laporan. Pastikan format Ticket ID benar.'
        );
        setReportData(null);
      }
    });
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      performSearch(ticketQuery);
    },
    [ticketQuery, performSearch]
  );

  useEffect(() => {
    const ticketId = (location.state as { ticketId?: string } | null)?.ticketId;
    if (ticketId) {
      const timer = setTimeout(() => {
        performSearch(ticketId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state, performSearch]);

  // Derived state to determine current status index in ordered progress
  const currentStatusIndex = ORDERED_STATUSES.indexOf(
    reportData?.status === 'rejected' ? 'resolved' : reportData?.status || ''
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh] flex flex-col justify-start">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 to-indigo-800 dark:from-sky-400 dark:to-indigo-300 bg-clip-text text-transparent">
          Lacak Status Aduan QRIS
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Masukkan nomor tiket pengaduan (Ticket ID) Anda untuk memantau progres
          peninjauan dan investigasi secara langsung.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="w-full max-w-xl mx-auto mb-12">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Contoh: SRS-2026-9051"
              value={ticketQuery}
              onChange={(e) => setTicketQuery(e.target.value)}
              className="pl-12 pr-4 h-12 w-full text-base rounded-xl border-border bg-card/60 backdrop-blur-md focus-visible:ring-primary shadow-sm"
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cari'}
          </Button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Result Panel */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">
            Menghubungkan ke server SIRIS...
          </p>
        </div>
      ) : reportData ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Status Badge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                TICKET ID
              </span>
              <h2 className="text-2xl font-bold text-secondary-foreground">
                {reportData.ticketId}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {(() => {
                const config = STATUS_CONFIG[reportData.status] || {
                  label: reportData.status.toUpperCase(),
                  colorClass: 'bg-muted border-border text-muted-foreground',
                  icon: HelpCircle,
                };
                const Icon = config.icon;
                return (
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.colorClass} font-semibold text-sm`}
                  >
                    <Icon className="w-5 h-5" />
                    {config.label}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Stepper / Progress Timeline */}
          {reportData.status !== 'rejected' ? (
            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="text-lg font-bold mb-8">
                Alur Investigasi Laporan
              </h3>
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Horizontal line for desktop stepper */}
                <div className="absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-border hidden md:block" />

                {ORDERED_STATUSES.map((statusKey, idx) => {
                  const config = STATUS_CONFIG[statusKey];
                  const Icon = config.icon;
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;

                  return (
                    <div
                      key={statusKey}
                      className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 text-left md:text-center group"
                    >
                      {/* Connection bar for mobile stepper */}
                      {idx < ORDERED_STATUSES.length - 1 && (
                        <div className="absolute top-12 left-6 bottom-0 w-0.5 bg-border md:hidden" />
                      )}

                      {/* Dot with Icon */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
                            : 'bg-card border-border text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Labels */}
                      <div className="mt-1 md:mt-4 space-y-1">
                        <p
                          className={`font-semibold text-sm transition-colors duration-200 ${
                            isCompleted
                              ? 'text-secondary-foreground font-bold'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {config.label}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <Ban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-700 dark:text-red-400">
                  Pengaduan Ditolak
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Laporan ini telah ditolak oleh tim verifikasi Bank Indonesia
                  karena dokumen bukti transaksi tidak lengkap, tidak jelas,
                  atau tidak terbukti mengandung surcharge merchant.
                </p>
              </div>
            </div>
          )}

          {/* Admin Response/Notes Panel */}
          {reportData.adminNotes && (
            <div className="p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Tanggapan Resmi Pengawas Bank Indonesia
              </div>
              <p className="text-secondary-foreground text-sm italic leading-relaxed pl-4 border-l-2 border-sky-500/40">
                &ldquo;{reportData.adminNotes}&rdquo;
              </p>
              <p className="text-[10px] text-muted-foreground text-right">
                Pembaruan terakhir:{' '}
                {new Date(reportData.updatedAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          )}

          {/* Report Information Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Merchant info card */}
            <Card className="border-border bg-card shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Detail Merchant Pelanggar
                </CardTitle>
                <CardDescription>
                  Informasi usaha yang dilaporkan konsumen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Nama Merchant</span>
                  <span className="font-semibold">
                    {reportData.merchantName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Kota / Wilayah</span>
                  <span>{reportData.merchantCity || '-'}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground block">
                    Alamat Merchant
                  </span>
                  <span className="text-xs text-secondary-foreground block leading-relaxed">
                    {reportData.merchantAddress || '-'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Event details card */}
            <Card className="border-border bg-card shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Rincian Kejadian & Bukti
                </CardTitle>
                <CardDescription>
                  Kronologi dan unggahan pendukung laporan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">
                    Tanggal Kejadian
                  </span>
                  <span>
                    {new Date(reportData.violationDate).toLocaleDateString(
                      'id-ID',
                      { dateStyle: 'medium' }
                    )}
                  </span>
                </div>
                {reportData.evidenceUrl && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">
                      Lampiran Bukti
                    </span>
                    <a
                      href={reportData.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium flex items-center gap-1.5"
                    >
                      Lihat Dokumen
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground block">
                    Kronologi Kejadian
                  </span>
                  <p className="text-xs text-secondary-foreground bg-muted/50 p-3 rounded-xl leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                    {reportData.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Empty/Guide State */
        <div className="border border-dashed border-border bg-card/40 rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Belum Ada Hasil Pencarian</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gunakan kotak pencarian di atas untuk memasukkan Ticket ID yang
            didapat dari resi setelah pengiriman formulir laporan aduan.
          </p>
        </div>
      )}
    </div>
  );
}
