'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiSave, HiUser, HiRefresh, HiExclamationCircle } from 'react-icons/hi';

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [adminName, setAdminName] = useState('');
  const [form, setForm] = useState({
    taskLink: '',
    rewardPerTask: 5,
    dailyTaskLimit: 10,
    requiredViewingTime: 15,
    minWithdrawal: 1500,
    referralBonusPercent: 30,
    withdrawalCharge: 5,
    welcomeBonus: 500,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminAPI.getSettings().then(r => r.data),
  });

  useEffect(() => {
    if (user) setAdminName(user.name || '');
  }, [user]);

  useEffect(() => {
    if (data) {
      setForm({
        taskLink: data.taskLink || '',
        rewardPerTask: data.rewardPerTask || 5,
        dailyTaskLimit: data.dailyTaskLimit || 10,
        requiredViewingTime: data.requiredViewingTime || 15,
        minWithdrawal: data.minWithdrawal || 1500,
        referralBonusPercent: data.referralBonusPercent ?? 30,
        withdrawalCharge: data.withdrawalCharge ?? 5,
        welcomeBonus: data.welcomeBonus || 500,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () => adminAPI.updateSettings(form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminSettings'] }); toast.success('Settings updated!'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const profileMutation = useMutation({
    mutationFn: () => adminAPI.updateProfile({ name: adminName }),
    onSuccess: () => {
      refreshUser();
      toast.success('Name updated!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const resetMutation = useMutation({
    mutationFn: () => adminAPI.resetRecords(),
    onSuccess: () => { toast.success('All records reset'); queryClient.invalidateQueries(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const reseedMutation = useMutation({
    mutationFn: () => adminAPI.reseedData(),
    onSuccess: () => { toast.success('All user data wiped'); queryClient.invalidateQueries(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="max-w-3xl space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure platform settings</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Profile */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4 flex items-center gap-2">
            <HiUser className="w-5 h-5 text-purple-500" /> Admin Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Display Name</label>
              <div className="flex gap-3">
                <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                <button type="button" onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending || !adminName.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50">
                  {profileMutation.isPending ? '...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Settings */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Task Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Default Task Link</label>
              <input type="url" value={form.taskLink} onChange={(e) => handleChange('taskLink', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">This link will be used for all daily tasks</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Reward Per Task (₦)</label>
              <input type="number" value={form.rewardPerTask} onChange={(e) => handleChange('rewardPerTask', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Daily Task Limit</label>
              <input type="number" value={form.dailyTaskLimit} onChange={(e) => handleChange('dailyTaskLimit', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Required Viewing Time (seconds)</label>
              <input type="number" value={form.requiredViewingTime} onChange={(e) => handleChange('requiredViewingTime', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Financial Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Minimum Withdrawal (₦)</label>
              <input type="number" value={form.minWithdrawal} onChange={(e) => handleChange('minWithdrawal', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Withdrawal Charge (%)</label>
              <input type="number" value={form.withdrawalCharge} onChange={(e) => handleChange('withdrawalCharge', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">Extra fee on top of withdrawal amount</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Referral Bonus (%) — Product Purchase</label>
              <input type="number" value={form.referralBonusPercent} onChange={(e) => handleChange('referralBonusPercent', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              <p className="text-xs text-gray-500 mt-1">Percentage of purchase price given to referrer</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Welcome Bonus (₦)</label>
              <input type="number" value={form.welcomeBonus} onChange={(e) => handleChange('welcomeBonus', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold transition disabled:opacity-50">
          <HiSave className="w-5 h-5" /> {updateMutation.isPending ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="max-w-3xl mt-8 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 card-shadow border border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
            <HiExclamationCircle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Destructive actions that cannot be undone.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => { if (confirm('Reset all records? Transactions, payments, and withdrawals will be cleared. Users are not affected.')) resetMutation.mutate(); }}
              disabled={resetMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50">
              <HiRefresh className="w-5 h-5" /> {resetMutation.isPending ? 'Resetting...' : 'Reset Records'}
            </button>
            <button onClick={() => { if (confirm('Wipe ALL user data? This deletes all users and their records. Only your admin account will remain.')) reseedMutation.mutate(); }}
              disabled={reseedMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50">
              <HiExclamationCircle className="w-5 h-5" /> {reseedMutation.isPending ? 'Wiping...' : 'Reseed (Wipe All Users)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
