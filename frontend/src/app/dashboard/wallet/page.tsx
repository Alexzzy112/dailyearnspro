'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import LoadingScreen from '@/components/LoadingScreen';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp, scaleIn } from '@/components/MotionComponents';
import { HiCurrencyDollar, HiClock, HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamationCircle, HiArrowRight } from 'react-icons/hi';

export default function WithdrawPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ amount: '', bankName: '', accountNumber: '', accountName: '' });
  const getNigeriaDay = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + 60 * 60000).getUTCDay();
  };
  const isFriday = getNigeriaDay() === 5;

  const { data, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => userAPI.getWallet().then(r => r.data),
  });

  const withdrawMutation = useMutation({
    mutationFn: () => userAPI.requestWithdrawal({
      amount: Number(form.amount),
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      accountName: form.accountName,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Withdrawal request submitted!');
      setForm({ amount: '', bankName: '', accountNumber: '', accountName: '' });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.bankName || !form.accountNumber || !form.accountName) {
      toast.error('Please fill in all fields');
      return;
    }
    if (Number(form.amount) < (data?.minWithdrawal || 1500)) {
      toast.error(`Minimum withdrawal is ₦${data?.minWithdrawal || 1500}`);
      return;
    }
    if (Number(form.amount) > (data?.walletBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    withdrawMutation.mutate();
  };

  const statusIcon: Record<string, any> = {
    pending: <HiClock className="w-5 h-5 text-yellow-500" />,
    approved: <HiCheckCircle className="w-5 h-5 text-green-500" />,
    rejected: <HiXCircle className="w-5 h-5 text-red-500" />,
    paid: <HiCheckCircle className="w-5 h-5 text-blue-500" />,
  };

  const statusBadge: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    approved: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    paid: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Withdraw Funds</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Request a withdrawal to your bank account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MotionDiv variants={scaleIn} initial="initial" animate="animate" className="card-pro-static overflow-hidden">
            <div className="relative gradient-primary p-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100 font-medium mb-1">Available Balance</p>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight">₦{(data?.walletBalance || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <HiCurrencyDollar className="w-7 h-7" />
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-2 text-sm text-blue-100">
                  <HiInformationCircle className="w-4 h-4 shrink-0" />
                  Min withdrawal: ₦{(data?.minWithdrawal || 1500).toLocaleString()}
                </div>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv variants={fadeInUp(0.15)} initial="initial" animate="animate" className="card-pro p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
                  <HiCurrencyDollar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Request Withdrawal</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
                <HiClock className="w-3.5 h-3.5" /> Friday only
              </div>
            </div>

            {!isFriday && (
              <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-3">
                <HiExclamationCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Withdrawals are only processed on Fridays</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Your request will not go through until Friday.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Amount (₦)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition text-lg"
                  placeholder={`Minimum ₦${data?.minWithdrawal || 1500}`} min={data?.minWithdrawal || 1500} max={data?.walletBalance || 0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Bank Name</label>
                  <input type="text" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="Access Bank" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Account Number</label>
                  <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="0123456789" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Account Name</label>
                  <input type="text" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="John Doe" />
                </div>
              </div>
              <button type="submit" disabled={!isFriday || withdrawMutation.isPending || (data?.walletBalance || 0) < (data?.minWithdrawal || 1500)}
                className="w-full gradient-accent text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40 text-lg flex items-center justify-center gap-2">
                {withdrawMutation.isPending ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><HiArrowRight className="w-5 h-5" /> Submit Withdrawal Request</>
                )}
              </button>
            </form>
          </MotionDiv>

          <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="card-pro p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <HiClock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Withdrawal History</h2>
              <span className="ml-auto text-xs font-medium text-gray-400">{data?.withdrawals?.length || 0} requests</span>
            </div>
            {data?.withdrawals?.length > 0 ? (
              <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="space-y-2.5">
                {data.withdrawals.map((w: any) => (
                  <MotionDiv key={w._id} variants={staggerItem} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-700/50 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                        <HiCurrencyDollar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary-700 dark:text-white">₦{w.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{w.bankName} &middot; {w.accountNumber}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusBadge[w.status] || ''}`}>
                      {statusIcon[w.status]} {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </MotionDiv>
                ))}
              </MotionDiv>
            ) : (
              <MotionDiv variants={fadeInUp(0)} className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <HiCurrencyDollar className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No withdrawal requests yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Submit your first withdrawal using the form above</p>
              </MotionDiv>
            )}
          </MotionDiv>
        </div>

        <MotionDiv variants={fadeInUp(0.25)} initial="initial" animate="animate" className="space-y-4">
          <div className="card-pro p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <HiInformationCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-secondary-700 dark:text-white">Withdrawal Info</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Minimum amount', value: `₦${(data?.minWithdrawal || 1500).toLocaleString()}`, color: 'text-secondary-700 dark:text-white' },
                { label: 'Withdrawal day', value: 'Friday only', color: 'text-amber-500' },
                { label: 'Processing time', value: '1-3 business days', color: 'text-secondary-700 dark:text-white' },
                { label: 'Account status', value: 'Must be active', color: 'text-secondary-700 dark:text-white' },
                { label: 'Balance', value: `₦${(data?.walletBalance || 0).toLocaleString()}`, color: 'text-accent-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
