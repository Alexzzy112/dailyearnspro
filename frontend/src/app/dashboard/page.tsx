'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiClipboardList, HiCurrencyDollar, HiUserGroup, HiCheckCircle, HiExclamationCircle, HiRefresh, HiTrendingUp } from 'react-icons/hi';

export default function DashboardPage() {
  const { refreshUser } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userAPI.getDashboard().then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const dashboard = data?.user;
  const settings = data?.settings;

  const stats = [
    { label: 'Wallet Balance', value: `₦${(dashboard?.walletBalance || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'gradient-primary', change: '+', href: '/dashboard/wallet' },
    { label: 'Tasks Completed', value: dashboard?.tasksCompleted || 0, icon: HiClipboardList, color: 'gradient-accent', change: '', href: '/dashboard/tasks' },
    { label: 'Today\'s Tasks', value: `${dashboard?.todayTasksCompleted || 0}/${settings?.dailyTaskLimit || 10}`, icon: HiCheckCircle, color: 'from-purple-500 to-pink-500', change: '', href: '/dashboard/tasks' },
    { label: 'Total Earnings', value: `₦${(dashboard?.totalEarnings || 0).toLocaleString()}`, icon: HiTrendingUp, color: 'from-orange-500 to-red-500', change: '', href: '/dashboard/wallet' },
    { label: 'Referrals', value: dashboard?.referralCount || 0, icon: HiUserGroup, color: 'from-teal-500 to-cyan-500', change: '', href: '/dashboard/referrals' },
    { label: 'Earnings Today', value: `₦${dashboard?.earningsToday || 0}`, icon: HiTrendingUp, color: 'from-indigo-500 to-purple-500', change: '', href: '/dashboard/tasks' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {dashboard?.name}!</p>
        </div>
        <button onClick={async () => { await refetch(); await refreshUser(); }} className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition">
          <HiRefresh className="w-5 h-5" /> Refresh
        </button>
      </div>

      {/* Account Status Banner */}
      {dashboard?.accountStatus === 'inactive' && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
          <HiExclamationCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">Account Not Activated</p>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm">Pay the activation fee to unlock daily tasks and start earning.</p>
          </div>
          <Link href="/dashboard/payments" className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition flex-shrink-0">
            Pay ₦{settings?.activationFee || 2000}
          </Link>
        </div>
      )}

      {dashboard?.accountStatus === 'suspended' && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <HiExclamationCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 font-medium">Account Suspended. Please contact support.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-accent-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-secondary-700 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {dashboard?.accountStatus === 'active' && (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/tasks" className="p-4 gradient-primary rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold">Start Tasks</p>
              <p className="text-sm text-blue-100 mt-1">{dashboard?.tasksRemaining || 0} tasks remaining</p>
            </Link>
            <Link href="/dashboard/wallet" className="p-4 gradient-accent rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold">Withdraw</p>
              <p className="text-sm text-green-100 mt-1">Min ₦1,500</p>
            </Link>
            <Link href="/dashboard/referrals" className="p-4 gradient-dark rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold">Refer Friends</p>
              <p className="text-sm text-gray-300 mt-1">Earn referral bonus</p>
            </Link>
            <Link href="/dashboard/payments" className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold">Fund Wallet</p>
              <p className="text-sm text-pink-100 mt-1">Deposit & start earning</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
