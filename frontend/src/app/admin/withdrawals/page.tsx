'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { MotionDiv, MotionTbody, MotionTr, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiCheckCircle, HiXCircle, HiTrash, HiCurrencyDollar, HiReply } from 'react-icons/hi';

export default function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ['adminWithdrawals'],
    queryFn: () => adminAPI.getWithdrawals().then(r => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminAPI.approveWithdrawal(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('Withdrawal approved'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminAPI.rejectWithdrawal(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('Withdrawal rejected'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const paidMutation = useMutation({
    mutationFn: (id: string) => adminAPI.markWithdrawalPaid(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('Marked as paid'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteWithdrawal(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('Withdrawal deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const revertMutation = useMutation({
    mutationFn: (id: string) => adminAPI.revertWithdrawal(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success('Withdrawal reverted to pending'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const revertAllMutation = useMutation({
    mutationFn: () => adminAPI.revertAllWithdrawals(),
    onSuccess: (data: any) => { queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] }); queryClient.invalidateQueries({ queryKey: ['adminDashboard'] }); toast.success(data.data?.message || 'All reverted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>{status}</span>;
  };

  if (isLoading) return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-52 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="p-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Withdrawal Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{withdrawals?.length || 0} total requests</p>
        </div>
        <button onClick={() => { if (confirm('Revert all approved and paid withdrawals back to pending?')) revertAllMutation.mutate(); }}
          disabled={revertAllMutation.isPending}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <HiReply className="w-4 h-4" /> {revertAllMutation.isPending ? 'Reverting...' : 'Revert All'}
        </button>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Amount</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Bank</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Account</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
              <MotionTbody variants={staggerContainer} initial="initial" animate="animate">
                {withdrawals?.map((w: any) => (
                  <MotionTr key={w._id} variants={staggerItem} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {w.userId?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-700 dark:text-white">{w.userId?.name}</p>
                        <p className="text-xs text-gray-500">@{w.userId?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-secondary-700 dark:text-white">₦{w.amount?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{w.bankName}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{w.accountNumber}<br/><span className="text-xs">{w.accountName}</span></td>
                  <td className="py-4 px-4">{statusBadge(w.status)}</td>
                  <td className="py-4 px-4 text-gray-500 text-xs">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {w.status === 'pending' && (
                        <>
                          <button onClick={() => approveMutation.mutate(w._id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Approve">
                            <HiCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => rejectMutation.mutate(w._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Reject">
                            <HiXCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {w.status === 'approved' && (
                        <>
                          <button onClick={() => paidMutation.mutate(w._id)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition" title="Mark as Paid">
                            <HiCurrencyDollar className="w-4 h-4" /> Paid
                          </button>
                          <button onClick={() => { if (confirm('Revert this withdrawal back to pending?')) revertMutation.mutate(w._id); }}
                            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition" title="Revert to Pending">
                            <HiReply className="w-4 h-4" /> Revert
                          </button>
                        </>
                      )}
                      {w.status === 'paid' && (
                        <button onClick={() => { if (confirm('Revert this paid withdrawal? Funds will be returned to user wallet.')) revertMutation.mutate(w._id); }}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition" title="Revert to Pending">
                          <HiReply className="w-4 h-4" /> Revert
                        </button>
                      )}
                      <button onClick={() => { if (confirm('Delete this withdrawal?')) deleteMutation.mutate(w._id); }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  </MotionTr>
                ))}
                {(!withdrawals || withdrawals.length === 0) && (
                  <MotionTr><td colSpan={7} className="text-center py-12 text-gray-500">No withdrawal requests</td></MotionTr>
                )}
              </MotionTbody>
          </table>
        </div>
      </div>
    </div>
  );
}
