'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  HiPhotograph, HiCheckCircle, HiXCircle, HiClock,
  HiClipboardCopy, HiCash, HiArrowRight, HiX, HiLockClosed
} from 'react-icons/hi';

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => userAPI.getWallet().then(r => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: () => userAPI.submitActivationPayment({ screenshot: screenshot || undefined } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Payment submitted! Awaiting admin approval.');
      setShowModal(false);
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
    pending: <HiClock className="w-5 h-5 text-yellow-500" />,
    confirmed: <HiCheckCircle className="w-5 h-5 text-green-500" />,
    rejected: <HiXCircle className="w-5 h-5 text-red-500" />,
  }[s]);

  const sc = (s: string) => ({
    pending: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    confirmed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    rejected: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  }[s]);

  const activationFee = data?.settings?.activationFee || 2000;
  const isActive = data?.user?.accountStatus === 'active';
  const lastPayment = data?.payments?.[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Payments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Activate your account and start earning</p>
      </div>

      {isActive && lastPayment?.status === 'confirmed' ? (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl card-shadow p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <HiCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-secondary-700 dark:text-white mb-2">Account Active</h2>
          <p className="text-gray-500 dark:text-gray-400">Your account is activated and you can start earning!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl card-shadow overflow-hidden">
          <div className="gradient-primary px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <HiLockClosed className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Activate Your Account</h2>
            <p className="text-blue-100 text-sm">Pay the activation fee to start earning</p>
            <div className="mt-6 inline-flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">₦{activationFee.toLocaleString()}</span>
              <span className="text-blue-200 text-sm">one-time fee</span>
            </div>
            <div className="mt-6">
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg">
                Pay Now <HiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-secondary-700 dark:text-white">Complete Payment</h3>
              <button onClick={() => { setShowModal(false); setScreenshot(null); setPreview(null); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-secondary-700/50 rounded-xl p-5 space-y-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Transfer <strong>₦{activationFee.toLocaleString()}</strong> to the account below and upload your payment proof
                </p>
                {[
                  { label: 'Account Number', value: data?.bankInfo?.accountNumber || 'N/A', copy: true },
                  { label: 'Account Name', value: data?.bankInfo?.accountName || 'N/A' },
                  { label: 'Bank Name', value: data?.bankInfo?.bankName || 'N/A' },
                ].map((i) => (
                  <div key={i.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{i.label}</p>
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
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition group">
                    {preview ? (
                      <div className="relative inline-block">
                        <img src={preview} alt="preview" className="max-h-48 rounded-lg mx-auto shadow-lg" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setScreenshot(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition">&times;</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-secondary-700 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition">
                          <HiPhotograph className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition" />
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
                  className="w-full flex items-center justify-center gap-2 gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
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
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-secondary-800 rounded-2xl card-shadow overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Payment History</h2>
        </div>
        <div className="p-6">
          {data?.payments?.length > 0 ? (
            <div className="space-y-3">
              {data.payments.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <HiCash className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary-700 dark:text-white">₦{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{p.reference ? `Ref: ${p.reference}` : ''}</p>
                      {p.screenshot && (
                        <a href={p.screenshot} target="_blank"
                          className="text-xs text-primary-500 hover:text-primary-600 inline-flex items-center gap-1 mt-1">
                          <HiPhotograph className="w-3 h-3" /> View Screenshot
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${sc(p.status) || ''}`}>
                    {st(p.status)} {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No payments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
