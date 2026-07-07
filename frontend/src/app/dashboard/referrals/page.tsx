'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiLink, HiClipboardCopy, HiCurrencyDollar, HiUserGroup, HiUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ReferralsPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => userAPI.getReferrals().then(r => r.data),
  });

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://drango.com'}/register?ref=${user?.referralCode || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Referrals</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Share your link and earn bonuses</p>
      </div>

      <MotionDiv variants={fadeInUp(0.05)} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="card-pro p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <HiUsers className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="stat-value text-secondary-700 dark:text-white">{data?.count || 0}</p>
          <p className="stat-label text-gray-400 mt-0.5">Total Referrals</p>
        </div>
        <div className="card-pro p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 gradient-accent rounded-xl flex items-center justify-center">
              <HiCurrencyDollar className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="stat-value text-secondary-700 dark:text-white">₦{(user?.referralEarnings || 0).toLocaleString()}</p>
          <p className="stat-label text-gray-400 mt-0.5">Referral Earnings</p>
        </div>
        <div className="card-pro p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 gradient-purple rounded-xl flex items-center justify-center">
<HiUserGroup className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="stat-value text-secondary-700 dark:text-white">{user?.referralCode}</p>
          <p className="stat-label text-gray-400 mt-0.5">Your Code</p>
        </div>
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.1)} initial="initial" animate="animate" className="card-pro p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 gradient-orange rounded-xl flex items-center justify-center">
            <HiLink className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Your Referral Link</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2.5 p-3.5 bg-gray-50 dark:bg-secondary-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex-1 break-all">
            <HiLink className="w-5 h-5 text-primary-500 shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 break-all font-medium">{referralLink}</span>
          </div>
          <button onClick={copyLink} className="flex items-center justify-center gap-2 gradient-primary text-white px-6 py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all shrink-0">
            <HiClipboardCopy className="w-5 h-5" /> Copy Link
          </button>
        </div>
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.15)} initial="initial" animate="animate" className="card-pro p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 gradient-pink rounded-xl flex items-center justify-center">
            <HiUserGroup className="w-4.5 h-4.5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Referral History</h2>
          <span className="ml-auto text-xs font-medium text-gray-400">{data?.count || 0} total</span>
        </div>
        <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="space-y-2.5">
          {data?.referrals?.length > 0 ? data.referrals.map((ref: any) => (
            <MotionDiv key={ref._id} variants={staggerItem} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-secondary-700/50 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                {ref.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary-700 dark:text-white truncate">{ref.name}</p>
                <p className="text-xs text-gray-500">@{ref.username} &middot; Joined {new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-accent-500">₦{ref.totalEarnings?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Earned</p>
              </div>
            </MotionDiv>
          )) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <HiUserGroup className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No referrals yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Share your link to start earning!</p>
            </div>
          )}
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
