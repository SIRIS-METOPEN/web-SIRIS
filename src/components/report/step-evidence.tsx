import React, { useState } from 'react';
import {
  Upload,
  Trash2,
  MapPin,
  User,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MapPicker } from '@/components/ui/map-picker';

interface StepEvidenceProps {
  evidenceFile: File | null;
  setEvidenceFile: (file: File | null) => void;
  evidencePreview: string | null;
  setEvidencePreview: (preview: string | null) => void;
  merchantCity: string;
  setMerchantCity: (val: string) => void;
  merchantAddress: string;
  setMerchantAddress: (val: string) => void;
  latitude: string;
  setLatitude: (val: string) => void;
  longitude: string;
  setLongitude: (val: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (val: boolean) => void;
  reporterName: string;
  setReporterName: (val: string) => void;
  reporterPhone: string;
  setReporterPhone: (val: string) => void;
  loading: boolean;
  onBack: () => void;
}

export function StepEvidence({
  evidenceFile,
  setEvidenceFile,
  evidencePreview,
  setEvidencePreview,
  merchantCity,
  setMerchantCity,
  merchantAddress,
  setMerchantAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  isAnonymous,
  setIsAnonymous,
  reporterName,
  setReporterName,
  reporterPhone,
  setReporterPhone,
  loading,
  onBack,
}: StepEvidenceProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file wajib berupa gambar (JPG, PNG, WEBP) atau PDF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file bukti maksimal 5MB');
      return;
    }
    setEvidenceFile(file);
    if (file.type.startsWith('image/')) {
      setEvidencePreview(URL.createObjectURL(file));
    } else {
      setEvidencePreview(null);
    }
  };

  const removeFile = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  return (
    <div className="space-y-8">
      {/* Evidence Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Upload className="h-5 w-5 text-[#0369A1]" />
          Unggah Bukti Transaksi
        </h2>

        <input
          id="evidenceInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          aria-label="Pilih file bukti"
        />
        <button
          type="button"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            isDragActive
              ? 'border-[#0369A1] bg-[#0369A1]/5'
              : 'border-slate-200 hover:border-[#0369A1]/50'
          }`}
          onClick={() => document.getElementById('evidenceInput')?.click()}
        >
          <div className="p-3 bg-slate-100 rounded-full text-slate-500">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <span className="text-sm font-bold text-slate-800 block">
              Klik untuk unggah atau seret file
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              JPG, PNG, PDF (Maks. 5MB)
            </span>
          </div>
        </button>

        {evidenceFile && (
          <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 overflow-hidden">
              {evidencePreview ? (
                <img
                  src={evidencePreview}
                  alt="Preview"
                  className="h-10 w-10 object-cover rounded-md"
                />
              ) : (
                <div className="h-10 w-10 bg-[#0369A1]/10 text-[#0369A1] font-bold text-xs flex items-center justify-center rounded-md">
                  PDF
                </div>
              )}
              <div className="overflow-hidden">
                <span className="text-sm font-bold text-slate-800 block truncate">
                  {evidenceFile.name}
                </span>
                <span className="text-xs text-slate-400">
                  {(evidenceFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              aria-label="Hapus Bukti Transaksi"
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="h-5 w-5 text-[#0369A1]" />
          Tandai Lokasi Merchant di Peta
        </h2>

        <div className="space-y-2">
          <Label
            htmlFor="searchAddress"
            className="text-slate-700 font-semibold"
          >
            Cari Alamat / Kota
          </Label>
          <Input
            id="searchAddress"
            placeholder="Cari Alamat/Kota"
            value={merchantCity}
            onChange={(e) => {
              setMerchantCity(e.target.value);
              if (!merchantAddress) setMerchantAddress(e.target.value);
            }}
            className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="physicalAddress"
            className="text-slate-700 font-semibold"
          >
            Alamat Lengkap Merchant
          </Label>
          <Input
            id="physicalAddress"
            placeholder="Masukkan alamat lengkap"
            value={merchantAddress}
            onChange={(e) => setMerchantAddress(e.target.value)}
            className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
          />
        </div>

        {/* Map Picker Component */}
        <div className="h-[250px] w-full rounded-2xl overflow-hidden shadow-sm relative z-0">
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="lat"
              className="text-slate-700 font-semibold text-xs"
            >
              Latitude
            </Label>
            <Input
              id="lat"
              value={latitude}
              disabled
              className="py-5 bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lng"
              className="text-slate-700 font-semibold text-xs"
            >
              Longitude
            </Label>
            <Input
              id="lng"
              value={longitude}
              disabled
              className="py-5 bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="h-5 w-5 text-[#0369A1]" />
          Pengaturan Privasi Laporan
        </h2>

        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex items-center justify-between gap-6">
          <div>
            <span className="font-bold text-slate-800 text-sm block">
              Kirim laporan sebagai Anonim
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Data diri Anda akan disembunyikan dari merchant.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            aria-label="Kirim laporan sebagai Anonim"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAnonymous ? 'bg-[#0369A1]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnonymous ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {!isAnonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-5 space-y-4 md:space-y-0">
            <div className="space-y-2">
              <Label htmlFor="repName" className="text-slate-700 font-semibold">
                Nama Lengkap Anda
              </Label>
              <Input
                id="repName"
                placeholder="Masukkan nama lengkap"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="repPhone"
                className="text-slate-700 font-semibold"
              >
                Nomor Telepon Anda
              </Label>
              <Input
                id="repPhone"
                placeholder="Masukkan nomor HP aktif"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-6 py-5 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-5 rounded-xl font-semibold bg-[#0369A1] hover:bg-[#0284c7] text-white transition-colors flex items-center gap-2"
        >
          {loading ? 'Mengirim...' : 'Kirim Laporan'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
