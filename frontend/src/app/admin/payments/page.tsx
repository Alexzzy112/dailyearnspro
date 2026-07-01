'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiPhotograph, HiExternalLink, HiTrash } from 'react-icons/hi';

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: () => adminAPI.getPayments().then(r => r.data),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => adminAPI.confirmPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayments'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['adminActivations'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Payment confirmed');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminAPI.rejectPayment(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminPayments'] }); toast.success('Payment rejected'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deletePayment(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminPayments'] }); toast.success('Payment deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>{status}</span>;
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      activation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      fund: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[type] || ''}`}>{type}</span>;
  };

  if (isLoading) return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Payment Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{payments?.length || 0} total payment requests</p>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Type</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Amount</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Reference</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Screenshot</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p: any) => (
                <tr key={p._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {p.userId?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-700 dark:text-white">{p.userId?.name}</p>
                        <p className="text-xs text-gray-500">@{p.userId?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{typeBadge(p.type)}</td>
                  <td className="py-4 px-4 font-bold text-secondary-700 dark:text-white">₦{p.amount?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300 font-mono text-xs max-w-[120px] truncate" title={p.reference}>{p.reference}</td>
                  <td className="py-4 px-4">
                    {p.screenshot ? (
                      <a href={p.screenshot} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 text-xs font-medium transition">
                        <HiPhotograph className="w-4 h-4" />
                        View
                        <HiExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs italic">None</span>
                    )}
                  </td>
                  <td className="py-4 px-4">{statusBadge(p.status)}</td>
                  <td className="py-4 px-4 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => confirmMutation.mutate(p._id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Confirm Payment">
                            <HiCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => rejectMutation.mutate(p._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Reject Payment">
                            <HiXCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button onClick={() => { if (confirm('Delete this payment?')) deleteMutation.mutate(p._id); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" title="Delete Payment">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!payments || payments.length === 0) && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-500">No payment requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
