'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiCurrencyDollar, HiClock, HiCheckCircle, HiXCircle, HiClipboardCopy, HiInformationCircle } from 'react-icons/hi';

export default function WithdrawPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ amount: '', bankName: '', accountNumber: '', accountName: '' });

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

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    approved: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    rejected: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    paid: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Withdraw Funds</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Request a withdrawal to your bank account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="gradient-primary rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">Available Balance</p>
                <p className="text-3xl font-bold">₦{(data?.walletBalance || 0).toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <HiCurrencyDollar className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm text-blue-100">
              <HiInformationCircle className="w-4 h-4" />
              Min: ₦{(data?.minWithdrawal || 1500).toLocaleString()} · Balance: ₦{data?.walletBalance?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Request Withdrawal</h2>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-secondary-700 px-3 py-1.5 rounded-full">
                <HiClock className="w-3.5 h-3.5" /> Mon · Wed · Fri
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Amount (₦)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition text-lg"
                  placeholder={`Minimum ₦${data?.minWithdrawal || 1500}`} min={data?.minWithdrawal || 1500} max={data?.walletBalance || 0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Bank Name</label>
                  <input type="text" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="Access Bank" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Account Number</label>
                  <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="0123456789" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Account Name</label>
                  <input type="text" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="John Doe" />
                </div>
              </div>
              <button type="submit" disabled={withdrawMutation.isPending || (data?.walletBalance || 0) < (data?.minWithdrawal || 1500)}
                className="w-full gradient-accent text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-lg">
                {withdrawMutation.isPending ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
            <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Withdrawal History</h2>
            {data?.withdrawals?.length > 0 ? (
              <div className="space-y-3">
                {data.withdrawals.map((w: any) => (
                  <div key={w._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-700">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <HiCurrencyDollar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary-700 dark:text-white">₦{w.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{w.bankName} · {w.accountNumber}</p>
                        <p className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${statusColor[w.status] || ''}`}>
                      {statusIcon[w.status]} {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HiCurrencyDollar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No withdrawal requests yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Submit your first withdrawal using the form above</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {data?.bankInfo?.bankName && (
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
              <h3 className="text-sm font-semibold text-secondary-700 dark:text-white mb-1">Company Bank Details</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Send payments to this account for wallet funding</p>
              <div className="space-y-3">
                {[
                  { label: 'Bank', value: data.bankInfo.bankName },
                  { label: 'Account Number', value: data.bankInfo.accountNumber, copyable: true },
                  { label: 'Account Name', value: data.bankInfo.accountName },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-secondary-700 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="text-sm font-bold text-secondary-700 dark:text-white">{item.value}</p>
                    </div>
                    {item.copyable && (
                      <button onClick={() => copy(item.value, item.label)}
                        className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition">
                        <HiClipboardCopy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <a href="/dashboard/payments" className="mt-4 block text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
                I&apos;ve made a payment →
              </a>
            </div>
          )}

          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
            <h3 className="text-sm font-semibold text-secondary-700 dark:text-white mb-3">Withdrawal Info</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Minimum amount', value: `₦${(data?.minWithdrawal || 1500).toLocaleString()}` },
                { label: 'Processing days', value: 'Mon, Wed, Fri' },
                { label: 'Processing time', value: '1-3 business days' },
                { label: 'Account status', value: 'Must be active' },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-secondary-700 dark:text-white">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
