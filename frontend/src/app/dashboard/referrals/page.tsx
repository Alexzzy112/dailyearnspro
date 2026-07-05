'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiLink, HiClipboardCopy, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
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
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Referrals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share your link and earn bonuses</p>
        </div>
      </div>

      {/* Referral Link */}
      <MotionDiv variants={fadeInUp(0)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
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
      </MotionDiv>

      {/* Referral List */}
      <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <HiUserGroup className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Referral History</h2>
          <span className="ml-auto text-xs font-medium text-gray-400">{data?.count || 0} total</span>
        </div>
        <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {data?.referrals?.length > 0 ? data.referrals.map((ref: any) => (
            <MotionDiv key={ref._id} variants={staggerItem} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-secondary-700/50 hover:bg-gray-100 dark:hover:bg-secondary-700 transition">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {ref.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary-700 dark:text-white truncate">{ref.name}</p>
                <p className="text-xs text-gray-500">@{ref.username} · Joined {new Date(ref.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-green-600">₦{ref.totalEarnings?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-gray-400">earned</p>
              </div>
            </MotionDiv>
          )) : (
            <div className="text-center py-8">
              <HiUserGroup className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No referrals yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Share your link to start earning!</p>
            </div>
          )}
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
