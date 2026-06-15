import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api';
import { StepMerchant } from '@/components/report/step-merchant';
import { StepTransaction } from '@/components/report/step-transaction';
import { StepEvidence } from '@/components/report/step-evidence';
import { StepSuccess } from '@/components/report/step-success';

export default function LaporkanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Form states
  const [merchantName, setMerchantName] = useState('');
  const [violationCategory, setViolationCategory] = useState('');
  const [violationDate, setViolationDate] = useState('');

  const [originalAmount, setOriginalAmount] = useState('');
  const [surchargeAmount, setSurchargeAmount] = useState('');
  const [feeChargingMethod, setFeeChargingMethod] = useState('Persentase (%)');
  const [description, setDescription] = useState('');

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [merchantCity, setMerchantCity] = useState('');
  const [merchantAddress, setMerchantAddress] = useState('');
  const [latitude, setLatitude] = useState('-6.2088');
  const [longitude, setLongitude] = useState('106.8456');

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Auto-fill coordinates if geolocated
  React.useEffect(() => {
    if (step === 3 && latitude === '-6.2088' && longitude === '106.8456') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          toast.success('Lokasi koordinat Anda berhasil terdeteksi');
        });
      }
    }
  }, [step, latitude, longitude]);

  const handleCopyCode = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      toast.success('Kode tracking berhasil disalin ke clipboard');
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!merchantName.trim()) {
        toast.error('Nama merchant wajib diisi');
        return;
      }
      if (!violationCategory) {
        toast.error('Kategori pelanggaran wajib dipilih');
        return;
      }
      if (!violationDate) {
        toast.error('Tanggal kejadian wajib diisi');
        return;
      }
    } else if (step === 2) {
      const numericOriginal = parseFloat(originalAmount) || 0;
      const numericSurcharge = parseFloat(surchargeAmount) || 0;

      if (!originalAmount || numericOriginal <= 0) {
        toast.error('Nominal transaksi asli wajib diisi dengan angka positif');
        return;
      }
      if (!surchargeAmount || numericSurcharge < 0) {
        toast.error('Biaya surcharge wajib diisi');
        return;
      }
      if (!description.trim() || description.length < 10) {
        toast.error('Kronologi kejadian wajib diisi minimal 10 karakter');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile) {
      toast.error('Bukti transaksi wajib diunggah');
      return;
    }
    if (!merchantCity.trim()) {
      toast.error('Kota merchant wajib diisi');
      return;
    }
    if (!merchantAddress.trim()) {
      toast.error('Alamat merchant wajib diisi');
      return;
    }
    if (!isAnonymous && (!reporterName.trim() || !reporterPhone.trim())) {
      toast.error(
        'Nama dan Nomor Telepon wajib diisi jika tidak melapor secara anonim'
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('merchantName', merchantName);
      formData.append('merchantCity', merchantCity);
      formData.append('merchantAddress', merchantAddress);
      formData.append('violationCategory', violationCategory);
      formData.append('violationDate', new Date(violationDate).toISOString());
      formData.append('originalAmount', originalAmount);
      formData.append('surchargeAmount', surchargeAmount);
      formData.append('feeChargingMethod', feeChargingMethod);
      formData.append('description', description);
      formData.append('evidence', evidenceFile);
      formData.append('isAnonymous', isAnonymous ? 'true' : 'false');

      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (!isAnonymous) {
        formData.append('reporterName', reporterName);
        formData.append('reporterPhone', reporterPhone);
      }

      const response = await fetchApi<{
        success: boolean;
        data: { ticketId: string };
      }>('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        setTicketId(response.data.ticketId);
        setStep(4); // Success Page
        toast.success('Laporan berhasil dikirim');
      } else {
        toast.error('Gagal mengirimkan laporan');
      }
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengirim laporan';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Success view
  if (step === 4 && ticketId) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans py-16 px-6">
        <StepSuccess
          ticketId={ticketId}
          onCopy={handleCopyCode}
          onHomeClick={() => navigate('/')}
          onTrackClick={() => navigate('/status')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Title Header */}
      <section className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Laporan Penyalahgunaan QRIS
          </h1>
          <p className="text-slate-500 font-light">
            Harap lengkapi detail berikut untuk validasi tim investigasi Bank
            Indonesia
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[700px] mx-auto px-6 mt-10">
        {/* Step Progress Bar */}
        <div className="relative flex items-center justify-between mb-8 max-w-[500px] mx-auto">
          {/* Progress Line Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-slate-200 -z-10 rounded-full" />
          {/* Active Progress Line */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#0369A1] -z-10 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {/* Step Nodes */}
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                  step > s
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : step === s
                      ? 'bg-[#0369A1] border-[#0369A1] text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  step >= s ? 'text-[#0369A1] font-bold' : 'text-slate-400'
                }`}
              >
                {s === 1 ? 'Merchant' : s === 2 ? 'Transaksi' : 'Unggah Bukti'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
            {step === 1 && (
              <StepMerchant
                merchantName={merchantName}
                setMerchantName={setMerchantName}
                violationCategory={violationCategory}
                setViolationCategory={setViolationCategory}
                violationDate={violationDate}
                setViolationDate={setViolationDate}
                onNext={handleNextStep}
              />
            )}

            {step === 2 && (
              <StepTransaction
                originalAmount={originalAmount}
                setOriginalAmount={setOriginalAmount}
                surchargeAmount={surchargeAmount}
                setSurchargeAmount={setSurchargeAmount}
                feeChargingMethod={feeChargingMethod}
                setFeeChargingMethod={setFeeChargingMethod}
                description={description}
                setDescription={setDescription}
                onNext={handleNextStep}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <StepEvidence
                evidenceFile={evidenceFile}
                setEvidenceFile={setEvidenceFile}
                evidencePreview={evidencePreview}
                setEvidencePreview={setEvidencePreview}
                merchantCity={merchantCity}
                setMerchantCity={setMerchantCity}
                merchantAddress={merchantAddress}
                setMerchantAddress={setMerchantAddress}
                latitude={latitude}
                longitude={longitude}
                isAnonymous={isAnonymous}
                setIsAnonymous={setIsAnonymous}
                reporterName={reporterName}
                setReporterName={setReporterName}
                reporterPhone={reporterPhone}
                setReporterPhone={setReporterPhone}
                loading={loading}
                onBack={() => setStep(2)}
              />
            )}

            {/* Bottom info banner */}
            <div className="flex gap-3 bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 mt-8 text-xs text-slate-500 leading-relaxed">
              <AlertCircle className="h-4 w-4 text-[#0369A1] flex-shrink-0" />
              Laporan Anda akan diproses secara rahasia. Bank Indonesia akan
              melakukan investigasi berdasarkan bukti yang Anda unggah.
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
