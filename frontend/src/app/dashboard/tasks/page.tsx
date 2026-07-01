'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiExternalLink, HiCheckCircle, HiClock, HiCurrencyDollar, HiLockClosed, HiShoppingBag } from 'react-icons/hi';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});
  const timersRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    const timers = timersRef.current;
    return () => { Object.values(timers).forEach(clearInterval); };
  }, []);

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userAPI.getDashboard().then(r => r.data),
  });

  const hasAccess = dashData?.user?.hasTaskAccess;

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => userAPI.getTasks().then(r => r.data),
    refetchInterval: 30000,
    enabled: hasAccess === true,
  });

  const claimMutation = useMutation({
    mutationFn: (taskNumber: number) => userAPI.claimTask(taskNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to claim reward');
    },
  });

  const handleStartTask = (task: any) => {
    if (task.completed) return;
    if (timersRef.current[task.taskNumber]) return;
    window.open(task.taskLink, '_blank');
    setActiveTimers(prev => ({ ...prev, [task.taskNumber]: 0 }));
    timersRef.current[task.taskNumber] = setInterval(() => {
      setActiveTimers(prev => ({ ...prev, [task.taskNumber]: (prev[task.taskNumber] || 0) + 1 }));
    }, 1000);
  };

  const handleClaimReward = (taskNumber: number, reward: number) => {
    claimMutation.mutate(taskNumber, {
      onSuccess: () => {
        toast.success(`Reward claimed! ₦${reward} added to wallet.`);
        clearInterval(timersRef.current[taskNumber]);
        delete timersRef.current[taskNumber];
        setActiveTimers(prev => {
          const next = { ...prev };
          delete next[taskNumber];
          return next;
        });
      }
    });
  };

  if (user?.accountStatus !== 'active') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <HiClock className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-secondary-700 dark:text-white mb-2">Account Not Active</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Activate your account to unlock daily tasks.</p>
        <a href="/dashboard/payments" className="gradient-primary text-white px-6 py-2 rounded-lg font-medium">Pay Activation Fee</a>
      </div>
    );
  }

  if (dashLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <HiLockClosed className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-secondary-700 dark:text-white mb-2">Tasks Locked</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Fund your wallet or purchase a product to unlock daily tasks.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Complete a payment or invest in any plan to start earning.</p>
        <div className="flex gap-3">
          <a href="/dashboard/wallet" className="gradient-primary text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            <HiCurrencyDollar className="w-4 h-4" /> Fund Wallet
          </a>
          <a href="/dashboard/products" className="gradient-accent text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            <HiShoppingBag className="w-4 h-4" /> View Plans
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const completedCount = data?.todayCompleted || 0;
  const dailyLimit = data?.dailyLimit || 10;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Daily Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Complete tasks and earn ₦5 each</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-accent-500">{completedCount}/{dailyLimit}</p>
          <p className="text-sm text-gray-500">Tasks Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Today&apos;s Progress</span>
          <span className="text-sm font-bold text-primary-500">₦{completedCount * 5} / ₦{dailyLimit * 5}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div className="gradient-primary h-4 rounded-full transition-all duration-500" style={{ width: `${dailyLimit > 0 ? (completedCount / dailyLimit) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.filter((t: any) => !t.completed).map((task: any) => {
          const taskTime = activeTimers[task.taskNumber] ?? -1;
          const isActive = taskTime >= 0;
          const canClaim = isActive && taskTime >= (task.requiredViewingTime || 15);

          return (
            <div key={task.taskNumber} className="bg-white dark:bg-secondary-800 rounded-xl p-5 card-shadow transition hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Task #{task.taskNumber}</span>
                <span className="flex items-center gap-1 text-accent-500 font-semibold text-sm">
                  <HiCurrencyDollar className="w-4 h-4" />+₦{task.reward}
                </span>
              </div>
              {task.title && <p className="text-sm font-semibold text-secondary-700 dark:text-white mb-1">{task.title}</p>}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{task.description}</p>
              {isActive && (
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <HiClock className="w-4 h-4 text-primary-500" />
                  <span className="text-primary-500 font-medium">{taskTime}s / {task.requiredViewingTime}s</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleStartTask(task)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition"
                  disabled={isActive}>
                  <HiExternalLink className="w-4 h-4" /> {isActive ? 'Visited' : 'Start Task'}
                </button>
                <button onClick={() => handleClaimReward(task.taskNumber, task.reward)}
                  disabled={!canClaim}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition">
                  <HiCheckCircle className="w-4 h-4" /> Claim ₦{task.reward}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
