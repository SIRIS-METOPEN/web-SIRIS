import { Receipt, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StepTransactionProps {
  originalAmount: string;
  setOriginalAmount: (val: string) => void;
  surchargeAmount: string;
  setSurchargeAmount: (val: string) => void;
  feeChargingMethod: string;
  setFeeChargingMethod: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepTransaction({
  originalAmount,
  setOriginalAmount,
  surchargeAmount,
  setSurchargeAmount,
  feeChargingMethod,
  setFeeChargingMethod,
  description,
  setDescription,
  onNext,
  onBack,
}: StepTransactionProps) {
  const numericOriginal = parseFloat(originalAmount) || 0;
  const numericSurcharge = parseFloat(surchargeAmount) || 0;
  const surchargePercentage =
    numericOriginal > 0
      ? ((numericSurcharge / numericOriginal) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Receipt className="h-5 w-5 text-[#0369A1]" />
        Nominal Transaksi & Pungutan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="originalAmount"
            className="text-slate-700 font-semibold"
          >
            Nominal Transaksi Asli (Rp)
          </Label>
          <Input
            id="originalAmount"
            type="number"
            placeholder="Rp 3000"
            value={originalAmount}
            onChange={(e) => setOriginalAmount(e.target.value)}
            className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="surchargeAmount"
            className="text-slate-700 font-semibold"
          >
            Biaya Surcharge Dikenakan (Rp)
          </Label>
          <Input
            id="surchargeAmount"
            type="number"
            placeholder="Rp 1000"
            value={surchargeAmount}
            onChange={(e) => setSurchargeAmount(e.target.value)}
            className="py-5 border-slate-200 focus-visible:ring-[#0369A1] rounded-xl"
          />
        </div>
      </div>

      {/* Surcharge Warn Banner */}
      {numericOriginal > 0 && numericSurcharge > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-50 border border-red-100 rounded-2xl p-5 text-red-900">
          <div className="flex gap-3 items-center">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <span className="font-bold block text-sm">
                Surcharge: Rp {numericSurcharge.toLocaleString('id-ID')} (
                {surchargePercentage}%)
              </span>
              <span className="text-xs text-red-700">
                Pengenaan biaya tambahan dilarang oleh Bank Indonesia.
              </span>
            </div>
          </div>
          <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider flex-shrink-0">
            Pelanggaran!
          </span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="method" className="text-slate-700 font-semibold">
          Metode Pembebanan Biaya
        </Label>
        <select
          id="method"
          value={feeChargingMethod}
          onChange={(e) => setFeeChargingMethod(e.target.value)}
          aria-label="Metode Pembebanan Biaya"
          className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:border-[#0369A1]"
        >
          <option>Persentase (%)</option>
          <option>Nominal Tetap (Flat Rp)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-700 font-semibold">
          Kronologi Detail Kejadian
        </Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Jelaskan secara rinci proses transaksi dan saat merchant meminta biaya tambahan..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Kronologi Detail Kejadian"
          className="w-full p-4 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:border-[#0369A1] resize-none"
        />
        <span className="text-[10px] text-slate-400 font-medium block mt-1">
          * Wajib diisi untuk mempermudah investigasi.
        </span>
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
