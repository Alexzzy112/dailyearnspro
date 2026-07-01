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
    { label: 'Today\'s Tasks', value: '0/10', icon: HiCheckCircle, color: 'from-purple-500 to-pink-500', change: '', href: '/dashboard/tasks' },
    { label: 'Total Earnings', value: `₦${(dashboard?.totalEarnings || 0).toLocaleString()}`, icon: HiTrendingUp, color: 'from-orange-500 to-red-500', change: '', href: '/dashboard/wallet' },
    { label: 'Referrals', value: dashboard?.referralCount || 0, icon: HiUserGroup, color: 'from-teal-500 to-cyan-500', change: '', href: '/dashboard/referrals' },
    { label: 'Earnings Today', value: `₦${dashboard?.earningsToday || 0}`, icon: HiTrendingUp, color: 'from-indigo-500 to-purple-500', change: '', href: '/dashboard/tasks' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-secondary-700 dark:text-white">Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, {dashboard?.name}!</p>
        </div>
        <button onClick={async () => { await refetch(); await refreshUser(); }} className="flex items-center gap-1 text-gray-500 hover:text-primary-500 transition text-sm">
          <HiRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Account Status Banner */}
      {dashboard?.accountStatus === 'inactive' && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
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
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <HiExclamationCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 font-medium">Account Suspended. Please contact support.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white dark:bg-secondary-800 rounded-xl p-3 card-shadow hover:shadow-md transition group">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-medium text-accent-500">{stat.change}</span>
            </div>
            <p className="text-base font-bold text-secondary-700 dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {dashboard?.accountStatus === 'active' && (
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 card-shadow">
          <h2 className="text-sm font-semibold text-secondary-700 dark:text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href="/dashboard/tasks" className="p-3 gradient-primary rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold text-sm">Start Tasks</p>
              <p className="text-[11px] text-blue-100 mt-0.5">Earns Daily</p>
            </Link>
            <Link href="/dashboard/wallet" className="p-3 gradient-accent rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold text-sm">Withdraw</p>
              <p className="text-[11px] text-green-100 mt-0.5">Fast Withdrawal</p>
            </Link>
            <Link href="/dashboard/referrals" className="p-3 gradient-dark rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold text-sm">Refer Friends</p>
              <p className="text-[11px] text-gray-300 mt-0.5">Earn bonus</p>
            </Link>
            <Link href="/dashboard/payments" className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white text-center hover:opacity-90 transition">
              <p className="font-semibold text-sm">Fund Wallet</p>
              <p className="text-[11px] text-pink-100 mt-0.5">Deposit & earn</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
