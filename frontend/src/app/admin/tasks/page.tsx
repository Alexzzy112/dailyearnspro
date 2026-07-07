'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import { HiSave, HiClipboardList, HiExternalLink } from 'react-icons/hi';

export default function AdminTasksPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    taskLink: '',
    taskTitle: '',
    taskDescription: '',
    dailyTaskLimit: 100,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminAPI.getSettings().then(r => r.data),
  });

  useEffect(() => {
    if (data) {
      setForm({
        taskLink: data.taskLink || '',
        taskTitle: data.taskTitle || 'Visit Sponsor',
        taskDescription: data.taskDescription || 'Click the link below, wait the required time, then claim your reward.',
        dailyTaskLimit: data.dailyTaskLimit || 100,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () => adminAPI.updateSettings(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      toast.success('Task settings updated! Changes reflect immediately for all users.');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Task Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the daily task that all users see</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSubmit}>
        <MotionDiv variants={fadeInUp(0)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <HiClipboardList className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Daily Task Configuration</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Task Title</label>
              <input type="text" value={form.taskTitle} onChange={(e) => setForm({ ...form, taskTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="e.g. Visit Sponsor" />
              <p className="text-xs text-gray-500 mt-1">Title shown at the top of each task card</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Task Description</label>
              <textarea value={form.taskDescription} onChange={(e) => setForm({ ...form, taskDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition resize-none"
                placeholder="e.g. Click the link below, wait 15 seconds, then claim your reward." />
              <p className="text-xs text-gray-500 mt-1">Instructions displayed to users for completing the task</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Number of Tasks (Daily Limit)</label>
              <input type="number" min={1} value={form.dailyTaskLimit} onChange={(e) => setForm({ ...form, dailyTaskLimit: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition" />
              <p className="text-xs text-gray-500 mt-1">How many tasks each user sees per day (currently <strong>{form.dailyTaskLimit} tasks</strong>)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Task Link</label>
              <div className="relative">
                <input type="url" value={form.taskLink} onChange={(e) => setForm({ ...form, taskLink: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition pl-10"
                  placeholder="https://example.com" />
                <HiExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">The URL users will visit to complete the task</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button type="submit" disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold transition disabled:opacity-50">
              <HiSave className="w-5 h-5" />
              {updateMutation.isPending ? 'Saving...' : 'Update Task'}
            </button>
          </div>
        </MotionDiv>
        </form>

        <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
          <h3 className="text-sm font-semibold text-secondary-700 dark:text-white mb-3">Preview (how users see it)</h3>
          <div className="bg-gray-50 dark:bg-secondary-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Task #1</span>
              <span className="flex items-center gap-1 text-accent-500 font-semibold text-sm">
                +₦{data?.rewardPerTask || 5}
              </span>
            </div>
            <p className="text-sm font-medium text-secondary-700 dark:text-white mb-2">{form.taskTitle || 'Visit Sponsor'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{form.taskDescription || 'Click the link below, wait the required time, then claim your reward.'}</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-primary-500/20 text-primary-500 text-center py-2.5 rounded-lg text-sm font-medium">
                Visit Link
              </div>
              <div className="flex-1 bg-gray-300 dark:bg-gray-600 text-white text-center py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                Claim
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Users will see <strong>{form.dailyTaskLimit} tasks</strong> per day (Mon-Fri). Changes apply immediately — no restart needed.</p>
        </MotionDiv>
      </div>
    </div>
  );
}
