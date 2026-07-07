'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiExternalLink, HiCheckCircle, HiClock, HiCurrencyDollar, HiLockClosed, HiShoppingBag, HiLightningBolt } from 'react-icons/hi';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
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

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (dashLoading) {
    return <LoadingScreen />;
  }

  if (hasAccess === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <HiLockClosed className="w-9 h-9 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-secondary-700 dark:text-white mb-2">Tasks Locked</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">Purchase an investment plan to unlock daily tasks and start earning.</p>
        <Link href="/dashboard/products" className="mt-6 gradient-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all">
          <HiShoppingBag className="w-4 h-4" /> View Plans
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (data?.tasksAvailable === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-900/10 rounded-3xl flex items-center justify-center mb-6">
          <HiClock className="w-9 h-9 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-secondary-700 dark:text-white mb-2">Tasks Unavailable Today</h2>
        <p className="text-gray-500 dark:text-gray-400">Tasks are only available Monday to Friday.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Come back on a weekday!</p>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const completedCount = data?.todayCompleted || 0;
  const dailyLimit = data?.dailyLimit || 100;
  const rewardAmt = tasks.length > 0 ? tasks[0].reward : 10;

  const progressPercent = dailyLimit > 0 ? (completedCount / dailyLimit) * 100 : 0;
  const totalEarned = completedCount * rewardAmt;
  const maxEarn = dailyLimit * rewardAmt;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Daily Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Complete up to <span className="font-semibold text-secondary-700 dark:text-white">{dailyLimit}</span> tasks and earn <span className="font-semibold text-accent-500">₦{rewardAmt}</span> each</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-secondary-700 dark:text-white">{completedCount}<span className="text-gray-400 text-lg font-normal">/{dailyLimit}</span></p>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Completed</p>
        </div>
      </div>

      <MotionDiv variants={fadeInUp(0.1)} initial="initial" animate="animate" className="card-pro p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <HiLightningBolt className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-secondary-700 dark:text-white">Today&apos;s Progress</span>
          </div>
          <span className="text-sm font-bold text-secondary-700 dark:text-white">₦{totalEarned.toLocaleString()} <span className="text-gray-400 font-normal">/ ₦{maxEarn.toLocaleString()}</span></span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-500 to-accent-500 transition-all duration-700 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 shimmer rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-gray-400">{completedCount} of {dailyLimit} tasks done</span>
          <span className="text-[11px] text-gray-400">{progressPercent.toFixed(0)}% complete</span>
        </div>
      </MotionDiv>

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.filter((t: any) => !t.completed).map((task: any) => {
          const taskTime = activeTimers[task.taskNumber] ?? -1;
          const isActive = taskTime >= 0;
          const canClaim = isActive && taskTime >= (task.requiredViewingTime || 15);
          const timerPercent = task.requiredViewingTime > 0 ? Math.min(100, (taskTime / task.requiredViewingTime) * 100) : 0;

          return (
            <MotionDiv key={task.taskNumber} variants={staggerItem} className="card-pro p-5 group">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <HiCurrencyDollar className="w-3 h-3" /> Task #{task.taskNumber}
                </span>
                <span className="flex items-center gap-1 text-accent-500 font-bold text-sm bg-accent-500/10 px-3 py-1 rounded-full">
                  +₦{task.reward}
                </span>
              </div>
              {task.title && <p className="text-sm font-semibold text-secondary-700 dark:text-white mb-1">{task.title}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
              {isActive && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <HiClock className="w-4 h-4 text-primary-500" />
                      <span className="text-primary-500 font-medium">{taskTime}s / {task.requiredViewingTime}s</span>
                    </div>
                    <span className="text-xs text-gray-400">{timerPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500 transition-all duration-1000" style={{ width: `${timerPercent}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleStartTask(task)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/20 disabled:shadow-none"
                  disabled={isActive}>
                  <HiExternalLink className="w-4 h-4" /> {isActive ? 'Visited' : 'Start Task'}
                </button>
                <button onClick={() => handleClaimReward(task.taskNumber, task.reward)}
                  disabled={!canClaim}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-accent-500/20 disabled:shadow-none">
                  <HiCheckCircle className="w-4 h-4" /> {canClaim ? `Claim ₦${task.reward}` : 'Claim'}
                </button>
              </div>
            </MotionDiv>
          );
        })}
      </MotionDiv>

      {tasks.filter((t: any) => !t.completed).length === 0 && completedCount > 0 && (
        <MotionDiv variants={fadeInUp(0.2)} initial="initial" animate="animate" className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <HiCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-secondary-700 dark:text-white mb-2">All Tasks Completed!</h2>
          <p className="text-gray-500 dark:text-gray-400">You&apos;ve completed all {dailyLimit} tasks today. Great work!</p>
          <p className="text-sm text-gray-400 mt-1">Come back tomorrow for more earning opportunities.</p>
        </MotionDiv>
      )}
    </div>
  );
}
