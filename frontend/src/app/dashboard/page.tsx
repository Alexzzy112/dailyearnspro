'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
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

  const testimonials = [
    { name: 'Chioma Okonkwo', amount: '50,000' },
    { name: 'Emeka Okafor', amount: '30,000' },
    { name: 'Aisha Bello', amount: '100,000' },
    { name: 'Daniel Kalu', amount: '45,000' },
    { name: 'Grace Adamu', amount: '75,000' },
    { name: 'Samuel Peter', amount: '60,000' },
    { name: 'Blessing Eze', amount: '200,000' },
    { name: 'John Musa', amount: '35,000' },
    { name: 'Favour Nnenna', amount: '80,000' },
    { name: 'Victor Idris', amount: '40,000' },
    { name: 'Precious Amara', amount: '150,000' },
    { name: 'Michael Samuel', amount: '55,000' },
    { name: 'Ruth David', amount: '90,000' },
    { name: 'Tunde Balogun', amount: '300,000' },
    { name: 'Esther Johnson', amount: '70,000' },
    { name: 'David Chukwu', amount: '250,000' },
    { name: 'Mercy Uche', amount: '120,000' },
    { name: 'Peter Adebayo', amount: '85,000' },
    { name: 'Sarah Williams', amount: '180,000' },
    { name: 'Joshua Tobi', amount: '65,000' },
  ];

  const stats = [
    { label: 'Wallet Balance', value: `₦${(dashboard?.walletBalance || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'gradient-primary', change: '+', href: '/dashboard/wallet' },
    { label: 'Tasks Completed', value: dashboard?.tasksCompleted || 0, icon: HiClipboardList, color: 'gradient-accent', change: '', href: '/dashboard/tasks' },
    { label: 'Today\'s Tasks', value: `${dashboard?.todayTasksCompleted || 0}/${settings?.dailyTaskLimit || 100}`, icon: HiCheckCircle, color: 'from-purple-500 to-pink-500', change: '', href: '/dashboard/tasks' },
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

      {dashboard?.accountStatus === 'suspended' && (
        <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-2 border-red-300 dark:border-red-800 rounded-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HiExclamationCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Account Suspended</h2>
          <p className="text-red-600 dark:text-red-300 font-medium">Account is suspended due to illegal activities</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-3">Please contact support for assistance.</p>
        </MotionDiv>
      )}

      {dashboard?.accountStatus !== 'suspended' && (
        <>
      {/* Testimonials Ticker */}
      <Link href="/dashboard/top-members">
        <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="mb-4 bg-white dark:bg-secondary-800 rounded-xl p-3 card-shadow overflow-hidden hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Withdrawals</p>
          </div>
          <div className="overflow-hidden relative">
            <div className="flex gap-6 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
              {[...testimonials, ...testimonials].map((w, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/10 rounded-full px-3 py-1.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {w.name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-secondary-700 dark:text-white">{w.name}</span>
                  <span className="text-xs text-gray-400">withdraw</span>
                  <span className="text-sm font-bold text-green-600">₦{w.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </Link>

      {/* Stats Grid */}
      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
        {stats.map((stat, i) => (
          <MotionDiv key={i} variants={staggerItem}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-medium text-accent-500">{stat.change}</span>
            </div>
            <p className="text-base font-bold text-secondary-700 dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Quick Actions */}
      {dashboard?.accountStatus === 'active' && (
        <MotionDiv variants={fadeInUp(0.3)} initial="initial" whileInView="animate" viewport={{ once: true }} className="bg-white dark:bg-secondary-800 rounded-xl p-4 card-shadow">
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
        </MotionDiv>
      )}
    </div>
  );
}
