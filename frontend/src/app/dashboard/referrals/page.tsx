'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiUserGroup, HiCurrencyDollar, HiLink, HiClipboardCopy, HiMail, HiPhone, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ReferralsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => userAPI.getReferrals().then(r => r.data),
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
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Referrals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Refer friends and earn bonuses</p>
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

      {/* Referral Link */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Your Referral Link</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 dark:bg-secondary-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <HiLink className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{referralLink}</span>
          </div>
          <button onClick={copyLink} className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition flex-shrink-0">
            <HiClipboardCopy className="w-5 h-5" /> Copy
          </button>
        </div>
      </div>

      {/* Referral List */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
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
