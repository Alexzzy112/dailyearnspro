'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiUserGroup, HiCurrencyDollar, HiLink, HiClipboardCopy, HiMail, HiPhone, HiClock, HiBadgeCheck, HiCash, HiX, HiPhotograph, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({ amount: '', reference: '' });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => userAPI.getReferrals().then(r => r.data),
  });

  const { data: bankInfo } = useQuery({
    queryKey: ['bankInfo'],
    queryFn: () => userAPI.getBankInfo().then(r => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('amount', payForm.amount);
      fd.append('reference', payForm.reference);
      if (screenshot) fd.append('screenshot', screenshot);
      return userAPI.submitPayment({ amount: Number(payForm.amount), reference: payForm.reference, screenshot: screenshot || undefined });
    },
    onSuccess: () => {
      toast.success('Payment submitted! Awaiting confirmation.');
      setShowPayment(false);
      setPayForm({ amount: '', reference: '' });
      setScreenshot(null);
      refreshUser();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Payment failed'),
  });

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://taskearnpro.com'}/register?ref=${user?.referralCode || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your account and referrals</p>
        </div>
      </div>

      {/* Payment Card - Click to open popup */}
      <div onClick={() => setShowPayment(true)} className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-6 card-shadow mb-8 cursor-pointer hover:opacity-90 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <HiCash className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Fund Your Wallet</p>
              <p className="text-sm text-white/80">Make a payment to activate tasks & earn</p>
            </div>
          </div>
          <HiCurrencyDollar className="w-8 h-8 text-white/60" />
        </div>
      </div>

      {/* Payment Popup */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPayment(false)}>
          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 w-full max-w-lg card-shadow max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-700 dark:text-white">Fund Wallet</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-lg transition">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Bank Details */}
            {bankInfo?.bankName && (
              <div className="bg-gray-50 dark:bg-secondary-700 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wider">Transfer to</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Bank</span>
                    <span className="text-sm font-semibold text-secondary-700 dark:text-white">{bankInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <span className="text-sm font-bold text-secondary-700 dark:text-white">{bankInfo.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account Name</span>
                    <span className="text-sm font-semibold text-secondary-700 dark:text-white">{bankInfo.accountName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Amount (₦)</label>
                <input type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Enter amount" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Reference / Sender Name</label>
                <input type="text" value={payForm.reference} onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Your name or transaction ref" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Screenshot of Payment</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition bg-gray-50 dark:bg-secondary-700">
                  {screenshot ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <HiCheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{screenshot.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <HiPhotograph className="w-8 h-8" />
                      <span className="text-sm">Tap to upload screenshot</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
                </label>
              </div>
              <button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || !payForm.amount || !payForm.reference}
                className="w-full gradient-accent text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitMutation.isPending ? 'Submitting...' : 'Submit Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-secondary-700 dark:text-white">{user?.name}</h2>
              {user?.accountStatus === 'active' && <HiBadgeCheck className="w-5 h-5 text-accent-500" />}
            </div>
            <p className="text-sm text-gray-500">@{user?.username} · {user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-500">₦{user?.walletBalance?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-500">Wallet Balance</p>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <HiUserGroup className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</span>
          </div>
          <p className="text-3xl font-bold text-secondary-700 dark:text-white">{data?.count || 0}</p>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
              <HiCurrencyDollar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Referral Earnings</span>
          </div>
          <p className="text-3xl font-bold text-accent-500">₦{user?.referralEarnings?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Referral Link - Mobile friendly wrap */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Your Referral Link</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-secondary-700 rounded-xl border border-gray-200 dark:border-gray-600 flex-1 break-all">
            <HiLink className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 break-all">{referralLink}</span>
          </div>
          <button onClick={copyLink} className="flex items-center justify-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition flex-shrink-0">
            <HiClipboardCopy className="w-5 h-5" /> Copy
          </button>
        </div>
      </div>

      {/* Referral List */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Referral History</h2>
        <div className="overflow-x-auto">
          {data?.referrals?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Username</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.referrals.map((ref: any) => (
                  <tr key={ref._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700">
                    <td className="py-3 px-2 text-secondary-700 dark:text-white font-medium">{ref.name}</td>
                    <td className="py-3 px-2 text-gray-500">@{ref.username}</td>
                    <td className="py-3 px-2 text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">No referrals yet. Share your link to start earning!</p>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-secondary-700 rounded-xl">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <HiMail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-secondary-700 dark:text-white">support@taskearnpro.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-secondary-700 rounded-xl">
            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <HiPhone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
              <p className="text-sm font-medium text-secondary-700 dark:text-white">+234 800 000 0000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-secondary-700 rounded-xl">
            <div className="w-10 h-10 gradient-dark rounded-xl flex items-center justify-center flex-shrink-0">
              <HiClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hours</p>
              <p className="text-sm font-medium text-secondary-700 dark:text-white">Mon - Sat: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
