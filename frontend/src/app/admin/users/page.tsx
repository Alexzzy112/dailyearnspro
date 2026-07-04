'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { MotionDiv, MotionTbody, MotionTr, staggerContainer, staggerItem, fadeInUp, scaleIn, AnimatePresence } from '@/components/MotionComponents';
import { HiSearch, HiXCircle, HiCheckCircle, HiTrash, HiCurrencyDollar } from 'react-icons/hi';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [walletModal, setWalletModal] = useState<{ id: string; name: string; balance: number } | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletType, setWalletType] = useState<'credit' | 'debit'>('credit');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers', search],
    queryFn: () => adminAPI.getUsers(search).then(r => r.data),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminAPI.suspendUser(id),
    onSuccess: (data: any) => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success(data.data?.message || 'Updated'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('User deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const walletMutation = useMutation({
    mutationFn: () => {
      if (!walletModal) return Promise.reject(new Error('No user selected'));
      return adminAPI.adjustWallet(walletModal.id, Number(walletAmount), walletType);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('Wallet updated'); setWalletModal(null); setWalletAmount(''); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>{status}</span>;
  };

  if (isLoading) return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      </div>
      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{users?.length || 0} total users</p>
        </div>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none w-64" />
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Email</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Balance</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Tasks</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
              <MotionTbody variants={staggerContainer} initial="initial" animate="animate">
                {users?.map((u: any) => (
                  <MotionTr key={u._id} variants={staggerItem} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-700 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="py-4 px-4">{statusBadge(u.accountStatus)}</td>
                  <td className="py-4 px-4 font-semibold text-secondary-700 dark:text-white">₦{u.walletBalance?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{u.tasksCompleted || 0}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => suspendMutation.mutate(u._id)}
                        className={`p-2 rounded-lg transition ${u.accountStatus === 'suspended' ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                        title={u.accountStatus === 'suspended' ? 'Activate' : 'Suspend'}>
                        {u.accountStatus === 'suspended' ? <HiCheckCircle className="w-5 h-5" /> : <HiXCircle className="w-5 h-5" />}
                      </button>
                      <button onClick={() => { setWalletModal({ id: u._id, name: u.name, balance: u.walletBalance }); setWalletAmount(''); setWalletType('credit'); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Adjust Wallet">
                        <HiCurrencyDollar className="w-5 h-5" />
                      </button>
                      <button onClick={() => { if (confirm('Delete this user?')) deleteMutation.mutate(u._id); }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  </MotionTr>
                ))}
                {(!users || users.length === 0) && (
                  <MotionTr><td colSpan={6} className="text-center py-12 text-gray-500">No users found</td></MotionTr>
                )}
              </MotionTbody>
          </table>
        </div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
      {walletModal && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <MotionDiv variants={scaleIn} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-2">Adjust Wallet</h2>
            <p className="text-sm text-gray-500 mb-1">{walletModal.name}</p>
            <p className="text-sm font-semibold text-accent-500 mb-4">Current Balance: ₦{walletModal.balance?.toLocaleString()}</p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setWalletType('credit')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${walletType === 'credit' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  Credit
                </button>
                <button onClick={() => setWalletType('debit')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${walletType === 'debit' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  Debit
                </button>
              </div>
              <input type="number" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} placeholder="Amount"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <div className="flex gap-3">
                <button onClick={() => walletMutation.mutate()} disabled={!walletAmount || walletMutation.isPending}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50">
                  {walletMutation.isPending ? 'Updating...' : 'Update'}
                </button>
                <button onClick={() => setWalletModal(null)} className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
      </AnimatePresence>
    </div>
  );
}
