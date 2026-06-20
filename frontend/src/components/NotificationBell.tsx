'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '@/lib/api';
import { HiBell, HiCheck, HiX } from 'react-icons/hi';
import Link from 'next/link';

const typeStyles: Record<string, string> = {
  success: 'border-l-4 border-l-green-500',
  warning: 'border-l-4 border-l-yellow-500',
  error: 'border-l-4 border-l-red-500',
  info: 'border-l-4 border-l-primary-500',
};

const typeIcons: Record<string, string> = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationAPI.getUnreadCount().then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => notificationAPI.getAll().then(r => r.data),
    enabled: open,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const count = unreadData?.count || 0;
  const notifications = notifData?.notifications || [];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
        <HiBell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-secondary-700 dark:text-white">Notifications</h3>
            {count > 0 && (
              <button onClick={() => markAllRead.mutate()}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                <HiCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <HiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n: any) => (
                <div key={n._id}
                  className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/30 transition ${!n.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''} ${typeStyles[n.type] || ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-base mt-0.5">{typeIcons[n.type] || 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-secondary-700 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && (
                      <button onClick={() => markRead.mutate(n._id)}
                        className="p-1 text-gray-400 hover:text-primary-500 transition flex-shrink-0">
                        <HiX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {n.link && (
                    <Link href={n.link}
                      className="text-xs text-primary-500 hover:text-primary-600 font-medium mt-2 inline-block ml-8">
                      View details →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
