'use client';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiUsers, HiUserGroup, HiCurrencyDollar, HiClipboardList, HiRefresh, HiTrendingUp, HiCash, HiClock, HiUserAdd, HiArrowUp, HiArrowDown } from 'react-icons/hi';

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminAPI.getDashboard().then(r => r.data),
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-52 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-4"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.totalUsers || 0, icon: HiUsers, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Users', value: data?.activeUsers || 0, icon: HiUserGroup, color: 'from-green-500 to-green-600' },
    { label: 'Inactive Users', value: data?.inactiveUsers || 0, icon: HiUsers, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Total Earnings', value: `₦${(data?.totalEarnings || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Revenue', value: `₦${(data?.totalRevenue || 0).toLocaleString()}`, icon: HiTrendingUp, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Tasks Completed', value: (data?.totalTasksCompleted || 0).toLocaleString(), icon: HiClipboardList, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Pending Withdrawals', value: data?.pendingWithdrawals || 0, icon: HiCurrencyDollar, color: 'from-red-500 to-red-600' },
    { label: 'Total Withdrawals', value: `₦${(data?.totalWithdrawals || 0).toLocaleString()}`, icon: HiCash, color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your platform</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition">
          <HiRefresh className="w-5 h-5" /> Refresh
        </button>
      </div>

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <MotionDiv key={i} variants={staggerItem} className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-secondary-700 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </MotionDiv>
        ))}
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.3)} initial="initial" animate="animate" className="mt-8 bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <HiClock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Recent User Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Action</th>
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Details</th>
                <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {!data?.recentActivity?.length && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No recent activity</td></tr>
              )}
              {data?.recentActivity?.map((log: any) => (
                <tr key={log._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50 transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {log.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-700 dark:text-white text-xs">{log.user?.name || 'System'}</p>
                        {log.user?.username && <p className="text-gray-400 text-xs">@{log.user.username}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {log.type === 'user_registered' && <HiUserAdd className="w-4 h-4 text-green-500" />}
                      {log.type === 'transaction' && (log.description?.includes('credit') || log.detail?.startsWith('+') ? <HiArrowDown className="w-4 h-4 text-green-500" /> : <HiArrowUp className="w-4 h-4 text-red-500" />)}
                      {log.type === 'withdrawal' && <HiArrowUp className="w-4 h-4 text-red-500" />}
                      {log.type === 'payment' && <HiCurrencyDollar className="w-4 h-4 text-blue-500" />}
                      <span className="text-gray-600 dark:text-gray-300 text-xs">{log.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{log.detail}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MotionDiv>
    </div>
  );
}
