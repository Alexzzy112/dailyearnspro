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
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
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

  const startMutation = useMutation({
    mutationFn: (taskNumber: number) => userAPI.startTask(taskNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to start task');
    },
  });

  const claimMutation = useMutation({
    mutationFn: (taskNumber: number) => userAPI.claimTask(taskNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to claim reward');
    },
  });

  const handleStartTask = (task: any) => {
    if (task.completed) return;
    window.open(task.taskLink, '_blank');
    startMutation.mutate(task.taskNumber);
  };

  const handleClaimReward = (taskNumber: number, reward: number) => {
    claimMutation.mutate(taskNumber, {
      onSuccess: () => {
        toast.success(`Reward claimed! ₦${reward} added to wallet.`);
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
  const viewTime = data?.viewTime || 15;
  const rewardAmt = tasks.length > 0 ? tasks[0].reward : 10;
  const productDailyEarn = dashData?.user?.productDailyEarn || 0;
  const activeTaskNum = data?.activeTaskNumber || 0;

  const progressPercent = dailyLimit > 0 ? (completedCount / dailyLimit) * 100 : 0;
  const totalEarned = productDailyEarn > 0
    ? Math.min(completedCount * rewardAmt, productDailyEarn)
    : completedCount * rewardAmt;
  const maxEarn = productDailyEarn > 0 ? productDailyEarn : dailyLimit * rewardAmt;

  const hasStarted = !!data?.taskStartedAt && !!activeTaskNum;
  const canClaim = hasStarted && elapsed >= viewTime;
  const timerPercent = viewTime > 0 ? Math.min(100, (elapsed / viewTime) * 100) : 0;
  const allDone = tasks.length > 0 && tasks.every((t: any) => t.completed);

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

      {hasStarted && (
        <MotionDiv variants={fadeInUp(0.08)} initial="initial" animate="animate" className="card-pro p-5 mb-6 border-2 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                <HiClock className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-secondary-700 dark:text-white">Task #{activeTaskNum} — Viewing Timer</span>
            </div>
            <span className={`text-sm font-bold ${canClaim ? 'text-green-500' : 'text-primary-500'}`}>
              {elapsed}s / {viewTime}s
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${canClaim ? 'bg-green-500' : 'bg-primary-500'}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {canClaim ? 'Timer complete! Claim your reward below.' : `Wait ${Math.max(0, viewTime - elapsed)} more seconds...`}
          </p>
        </MotionDiv>
      )}

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task: any) => {
          const isActive = hasStarted && task.taskNumber === activeTaskNum;
          const isLocked = hasStarted && !task.completed && !isActive;

          return (
            <MotionDiv key={task.taskNumber} variants={staggerItem} className={`card-pro p-5 ${task.completed ? 'opacity-60' : ''} ${isLocked ? 'opacity-40' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <HiCurrencyDollar className="w-3 h-3" /> Task #{task.taskNumber}
                  {task.completed && <HiCheckCircle className="w-3 h-3 text-green-500" />}
                </span>
                <span className="flex items-center gap-1 text-accent-500 font-bold text-sm bg-accent-500/10 px-3 py-1 rounded-full">
                  +₦{task.reward}
                </span>
              </div>
              {task.title && <p className="text-sm font-semibold text-secondary-700 dark:text-white mb-1">{task.title}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
              <div className="flex gap-2">
                {task.completed ? (
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 py-2.5 rounded-xl text-sm font-medium">
                    <HiCheckCircle className="w-4 h-4" /> Completed
                  </div>
                ) : isActive ? (
                  <>
                    <button disabled className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500/80 text-white py-2.5 rounded-xl text-sm font-medium disabled:shadow-none">
                      <HiExternalLink className="w-4 h-4" /> Viewing...
                    </button>
                    <button onClick={() => handleClaimReward(task.taskNumber, task.reward)}
                      disabled={!canClaim}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-accent-500/20 disabled:shadow-none">
                      <HiCheckCircle className="w-4 h-4" /> {canClaim ? `Claim ₦${task.reward}` : 'Claim'}
                    </button>
                  </>
                ) : isLocked ? (
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-400 py-2.5 rounded-xl text-sm font-medium">
                    <HiLockClosed className="w-4 h-4" /> Finish active task first
                  </div>
                ) : (
                  <button onClick={() => handleStartTask(task)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/20">
                    <HiExternalLink className="w-4 h-4" /> Start Task
                  </button>
                )}
              </div>
            </MotionDiv>
          );
        })}
      </MotionDiv>

      {allDone && (
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
