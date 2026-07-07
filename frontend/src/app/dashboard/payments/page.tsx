'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { MotionDiv, AnimatePresence, staggerContainer, staggerItem, fadeInUp, scaleIn } from '@/components/MotionComponents';
import CarImage from '@/components/CarImages';
import { HiShoppingBag, HiPhotograph, HiCheckCircle, HiXCircle, HiClock, HiClipboardCopy, HiArrowRight, HiX } from 'react-icons/hi';

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => userAPI.getWallet().then(r => r.data),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => userAPI.getProducts().then(r => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: () => userAPI.submitPayment({ amount: selectedAmount, reference: 'Wallet Funding', screenshot: screenshot || undefined } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Payment submitted! Awaiting admin approval.');
      setSelectedAmount(null);
      setScreenshot(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setScreenshot(file);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) { toast.error('Upload payment screenshot'); return; }
    submitMutation.mutate();
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const st = (s: string) => ({
    pending: <HiClock className="w-4 h-4 text-yellow-500" />,
    confirmed: <HiCheckCircle className="w-4 h-4 text-green-500" />,
    rejected: <HiXCircle className="w-4 h-4 text-red-500" />,
  }[s]);

  const sc = (s: string) => ({
    pending: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    confirmed: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    rejected: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  }[s]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Fund Wallet</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Select an amount to fund your wallet via bank transfer</p>
      </div>

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {products?.map((product: any) => (
          <MotionDiv key={product._id} variants={staggerItem}>
              <button onClick={() => setSelectedAmount(product.price)}
              className={`w-full card-pro text-center group border-2 transition-all duration-300 overflow-hidden ${
                selectedAmount === product.price
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 ring-2 ring-primary-500/20'
                  : 'border-transparent hover:border-primary-200 dark:hover:border-primary-800'
              }`}>
              <CarImage price={product.price} />
              <div className="p-3">
                <p className="text-lg font-bold text-secondary-700 dark:text-white">₦{product.price?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{product.name}</p>
              </div>
            </button>
          </MotionDiv>
        ))}
        {(!products || products.length === 0) && (
          <MotionDiv variants={staggerItem} className="col-span-full text-center text-gray-500 py-12">No funding options available</MotionDiv>
        )}
      </MotionDiv>

      <AnimatePresence>
      {selectedAmount && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <MotionDiv variants={scaleIn} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <HiShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-700 dark:text-white">Fund Wallet</h3>
                  <p className="text-xs text-gray-400">₦{selectedAmount.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedAmount(null); setScreenshot(null); setPreview(null); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-xl p-5 space-y-4 border border-gray-100 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Transfer <strong className="text-primary-500">₦{selectedAmount.toLocaleString()}</strong> to the account below and upload your payment proof
                </p>
                {[
                  { label: 'Account Number', value: walletData?.bankInfo?.accountNumber || 'N/A', copy: true },
                  { label: 'Account Name', value: walletData?.bankInfo?.accountName || 'N/A' },
                  { label: 'Bank Name', value: walletData?.bankInfo?.bankName || 'N/A' },
                ].map((i) => (
                  <div key={i.label} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600/50 last:border-0">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{i.label}</p>
                      <p className="text-base font-bold text-secondary-700 dark:text-white">{i.value}</p>
                    </div>
                    {i.copy && (
                      <button onClick={() => copy(i.value, i.label)}
                        className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition">
                        <HiClipboardCopy className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Upload Payment Screenshot</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all group bg-gray-50/50 dark:bg-secondary-700/30">
                    {preview ? (
                      <div className="relative inline-block">
                        <img src={preview} alt="preview" className="max-h-48 rounded-lg mx-auto shadow-lg" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setScreenshot(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition shadow-sm">&times;</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-secondary-700 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-all">
                          <HiPhotograph className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          <span className="text-primary-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>

                <button type="submit" disabled={submitMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 gradient-primary text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50">
                  {submitMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Submit Payment <HiArrowRight className="w-4 h-4" /></span>
                  )}
                </button>
              </form>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
      </AnimatePresence>

      <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="card-pro overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
              <HiShoppingBag className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Payment History</h2>
            <span className="ml-auto text-xs font-medium text-gray-400">{walletData?.payments?.length || 0} payments</span>
          </div>
        </div>
        <div className="p-6">
          {walletData?.payments?.length > 0 ? (
            <div className="space-y-2.5">
              {walletData.payments.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-700/50 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                      <HiShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary-700 dark:text-white">₦{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.reference || `Ref: ${p._id?.slice(-6)}`}</p>
                      {p.screenshot && (
                        <a href={p.screenshot} target="_blank"
                          className="text-xs text-primary-500 hover:text-primary-600 inline-flex items-center gap-1 mt-1">
                          <HiPhotograph className="w-3 h-3" /> View Screenshot
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${sc(p.status) || ''}`}>
                    {st(p.status)} {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <HiShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No payments yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Select an amount above to fund your wallet</p>
            </div>
          )}
        </div>
      </MotionDiv>
    </div>
  );
}
