'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { MotionDiv, fadeInUp } from '@/components/MotionComponents';
import { HiBell, HiCheck, HiX, HiMail, HiUser, HiUsers, HiSelector } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ username: '', title: '', message: '', type: 'info' });
  const [sendTo, setSendTo] = useState<'all' | 'single'>('all');

  const { data: usersData } = useQuery({
    queryKey: ['adminAllUsers'],
    queryFn: () => adminAPI.getUsers().then(r => r.data),
    enabled: sendTo === 'single',
  });
  const users = Array.isArray(usersData) ? usersData : [];

  const { data } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => adminAPI.getNotifications().then(r => r.data),
  });

  const sendMutation = useMutation({
    mutationFn: () => adminAPI.createNotification(
      sendTo === 'all' ? { title: form.title, message: form.message, type: form.type }
        : { username: form.username, title: form.title, message: form.message, type: form.type }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      toast.success('Notification sent');
      setForm({ username: '', title: '', message: '', type: 'info' });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Title and message are required'); return; }
    if (sendTo === 'single' && !form.username) { toast.error('Select a user'); return; }
    sendMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Notifications</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Send notifications to users</p>
      </div>

      <MotionDiv variants={fadeInUp(0)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl card-shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4 flex items-center gap-2">
          <HiMail className="w-5 h-5 text-purple-500" /> Send Notification
        </h2>

        <div className="flex gap-4 mb-4">
          <button onClick={() => setSendTo('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${sendTo === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <HiUsers className="w-4 h-4" /> All Users
          </button>
          <button onClick={() => setSendTo('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${sendTo === 'single' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <HiUser className="w-4 h-4" /> Specific User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {sendTo === 'single' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Select User</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition appearance-none">
                  <option value="">-- Select a user --</option>
                  {users.map((u: any) => (
                    <option key={u._id} value={u.username}>
                      @{u.username} - {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <HiSelector className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. System Update"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your notification message..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition">
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <button type="submit" disabled={sendMutation.isPending}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {sendMutation.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
            ) : (
              <><HiMail className="w-4 h-4" /> Send Notification</>
            )}
          </button>
        </form>
      </MotionDiv>

      <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl card-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-secondary-700 dark:text-white">Recent Notifications</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {data?.notifications?.length > 0 ? (
            data.notifications.slice(0, 50).map((n: any) => (
              <div key={n._id} className="p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.type === 'success' ? 'bg-green-100 text-green-600' :
                  n.type === 'error' ? 'bg-red-100 text-red-600' :
                  n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'success' ? <HiCheck className="w-4 h-4" /> :
                   n.type === 'error' ? <HiX className="w-4 h-4" /> :
                   <HiBell className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-700 dark:text-white">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    To: {n.userId?.name || n.userId?.username || n.userId?._id || 'Unknown'} ({n.userId?.email || ''})
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  n.read ? 'bg-gray-100 text-gray-500' : 'bg-purple-100 text-purple-600'
                }`}>
                  {n.read ? 'Read' : 'New'}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              <HiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications sent yet</p>
            </div>
          )}
        </div>
      </MotionDiv>
    </div>
  );
}
