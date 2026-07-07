'use client';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiClipboardList, HiCurrencyDollar, HiUserGroup, HiCheckCircle, HiExclamationCircle, HiRefresh, HiTrendingUp, HiArrowUp, HiArrowDown, HiShoppingBag, HiStar } from 'react-icons/hi';

export default function DashboardPage() {
  const { refreshUser } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userAPI.getDashboard().then(r => r.data),
  });

  if (isLoading) {
    return <LoadingScreen />;
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
    { label: 'Wallet Balance', value: `₦${(dashboard?.walletBalance || 0).toLocaleString()}`, icon: HiCurrencyDollar, gradient: 'gradient-primary', href: '/dashboard/wallet', sub: 'Available balance' },
    { label: 'Tasks Completed', value: dashboard?.tasksCompleted || 0, icon: HiClipboardList, gradient: 'gradient-teal', href: '/dashboard/tasks', sub: 'All time' },
    { label: 'Today\'s Tasks', value: `${dashboard?.todayTasksCompleted || 0}/${settings?.dailyTaskLimit || 100}`, icon: HiCheckCircle, gradient: 'gradient-purple', href: '/dashboard/tasks', sub: `${dashboard?.todayTasksCompleted || 0} done today` },
    { label: 'Total Earnings', value: `₦${(dashboard?.totalEarnings || 0).toLocaleString()}`, icon: HiTrendingUp, gradient: 'gradient-orange', href: '/dashboard/wallet', sub: 'Lifetime earnings' },
    { label: 'Referrals', value: dashboard?.referralCount || 0, icon: HiUserGroup, gradient: 'gradient-pink', href: '/dashboard/referrals', sub: `${dashboard?.referralCount || 0} friends joined` },
    { label: 'Earnings Today', value: `₦${dashboard?.earningsToday || 0}`, icon: HiStar, gradient: 'gradient-indigo', href: '/dashboard/tasks', sub: 'Today\'s reward' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, <span className="font-semibold text-secondary-700 dark:text-white">{dashboard?.name}</span></p>
        </div>
        <button onClick={async () => { await refetch(); await refreshUser(); }} className="flex items-center gap-1.5 text-gray-400 hover:text-primary-500 transition text-sm font-medium bg-white dark:bg-secondary-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800">
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
          <MotionDiv variants={fadeInUp(0.1)} initial="initial" animate="animate" className="mb-6 card-pro overflow-hidden">
            <Link href="/dashboard/top-members" className="block">
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Live Withdrawals</p>
                </div>
                <div className="overflow-hidden relative">
                  <div className="flex gap-4 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
                    {[...testimonials, ...testimonials].map((w, i) => (
                      <div key={i} className="inline-flex items-center gap-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/15 dark:to-emerald-900/15 rounded-full px-4 py-2 border border-green-100 dark:border-green-800/30">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm">
                          {w.name.charAt(0)}
                        </span>
                        <span className="text-sm font-medium text-secondary-700 dark:text-white">{w.name}</span>
                        <span className="text-xs text-gray-400">withdrew</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">₦{w.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </MotionDiv>

          <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {stats.map((stat, i) => (
              <MotionDiv key={i} variants={staggerItem}>
                <Link href={stat.href} className="card-pro p-4 sm:p-5 block group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="stat-value text-secondary-700 dark:text-white leading-none">{stat.value}</p>
                      <p className="stat-label text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{stat.sub}</span>
                    <span className="text-[11px] text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View &rarr;</span>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </MotionDiv>

          {dashboard?.purchasedProduct && (
            <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="mb-6">
              <div className="card-pro p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                    <HiShoppingBag className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Active Investment</p>
                    <p className="text-lg font-bold text-secondary-700 dark:text-white truncate">{dashboard.purchasedProductName || 'Active Plan'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-500">
                        <HiTrendingUp className="w-3.5 h-3.5" />+₦{dashboard.productDailyEarn?.toLocaleString() || 0}/day
                      </span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500">Today: ₦{dashboard?.earningsToday || 0}</span>
                    </div>
                  </div>
                  <Link href="/dashboard/products" className="shrink-0 text-xs font-medium text-primary-500 hover:text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg transition-colors">
                    Upgrade
                  </Link>
                </div>
              </div>
            </MotionDiv>
          )}

          {dashboard?.accountStatus === 'active' && (
            <MotionDiv variants={fadeInUp(0.25)} initial="initial" whileInView="animate" viewport={{ once: true }} className="mb-6 card-pro p-5">
              <h2 className="text-sm font-semibold text-secondary-700 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Link href="/dashboard/tasks" className="group relative overflow-hidden gradient-primary rounded-xl p-3.5 text-white hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <p className="relative font-semibold text-sm">Start Tasks</p>
                  <p className="relative text-[11px] text-blue-100 mt-0.5">Earn daily</p>
                </Link>
                <Link href="/dashboard/wallet" className="group relative overflow-hidden gradient-accent rounded-xl p-3.5 text-white hover:shadow-lg hover:shadow-accent-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <p className="relative font-semibold text-sm">Withdraw</p>
                  <p className="relative text-[11px] text-green-100 mt-0.5">Fast payout</p>
                </Link>
                <Link href="/dashboard/referrals" className="group relative overflow-hidden gradient-purple rounded-xl p-3.5 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <p className="relative font-semibold text-sm">Refer Friends</p>
                  <p className="relative text-[11px] text-purple-100 mt-0.5">Earn bonus</p>
                </Link>
                <Link href="/dashboard/payments" className="group relative overflow-hidden gradient-pink rounded-xl p-3.5 text-white hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <p className="relative font-semibold text-sm">Fund Wallet</p>
                  <p className="relative text-[11px] text-pink-100 mt-0.5">Deposit now</p>
                </Link>
              </div>
            </MotionDiv>
          )}

          {data?.transactions?.length > 0 && (
            <MotionDiv variants={fadeInUp(0.3)} initial="initial" whileInView="animate" viewport={{ once: true }} className="card-pro p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-secondary-700 dark:text-white">Transaction History</h2>
                <span className="text-[11px] text-gray-400">{data.transactions.length} records</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {data.transactions.slice(0, 8).map((tx: any) => {
                  const isCredit = tx.type === 'credit';
                  const gradient = isCredit ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600';
                  const Icon = isCredit ? HiArrowUp : HiArrowDown;
                  return (
                    <div key={tx._id} className={`relative overflow-hidden bg-gradient-to-r ${gradient} rounded-xl p-3.5 text-white shadow-sm`}>
                      <div className="absolute top-2 right-2 opacity-10">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className="w-3 h-3" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{tx.type}</span>
                        </div>
                        <p className="font-bold text-sm">₦{tx.amount?.toLocaleString()}</p>
                        <p className="text-[10px] opacity-75 mt-0.5 truncate">{tx.description}</p>
                        <p className="text-[9px] opacity-50 mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </MotionDiv>
          )}
        </>
      )}
    </div>
  );
}
