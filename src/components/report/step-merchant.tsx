import { Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CATEGORIES = [
  {
    value: 'surcharge_percentage',
    label: 'Pengenaan Biaya Tambahan / Surcharge (%)',
  },
  {
    value: 'surcharge_flat',
    label: 'Pengenaan Biaya Tambahan Flat (Contoh: Rp 1.000)',
  },
  {
    value: 'minimum_limit',
    label: 'Pemberlakuan Batas Minimum Pembayaran QRIS',
  },
  {
    value: 'cash_only_forcing',
    label: 'Paksaan Pembayaran Tunai saat QRIS Tersedia',
  },
  { value: 'others', label: 'Lainnya' },
];

interface StepMerchantProps {
  merchantName: string;
  setMerchantName: (val: string) => void;
  violationCategory: string;
  setViolationCategory: (val: string) => void;
  violationDate: string;
  setViolationDate: (val: string) => void;
  onNext: () => void;
}

export function StepMerchant({
  merchantName,
  setMerchantName,
  violationCategory,
  setViolationCategory,
  violationDate,
  setViolationDate,
  onNext,
}: StepMerchantProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Building2 className="h-5 w-5 text-[#0369A1]" />
        Informasi Merchant
      </h2>

      <div className="space-y-2">
        <Label htmlFor="merchantName" className="text-slate-700 font-semibold">
          Nama Toko / Merchant
        </Label>
        <Input
          id="merchantName"
          placeholder="Contoh: Toko Berkah Jaya"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
          className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-slate-700 font-semibold">
            Kategori Pelanggaran
          </Label>
          <select
            id="category"
            value={violationCategory}
            onChange={(e) => setViolationCategory(e.target.value)}
            aria-label="Kategori Pelanggaran"
            className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:border-[#0369A1]"
          >
            <option value="">Pilih Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="violationDate"
            className="text-slate-700 font-semibold"
          >
            Tanggal Kejadian
          </Label>
          <Input
            id="violationDate"
            type="date"
            value={violationDate}
            onChange={(e) => setViolationDate(e.target.value)}
            className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          onClick={onNext}
          className="px-6 py-5 rounded-xl font-semibold bg-[#0369A1] hover:bg-[#0284c7] text-white transition-colors"
        >
          Lanjut
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
