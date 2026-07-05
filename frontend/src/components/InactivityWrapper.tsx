'use client';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const INACTIVITY_LIMIT = 10 * 60 * 1000;
const WARNING_TIME = 30 * 1000;

export default function InactivityWrapper({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const clearTimers = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };

    const resetTimer = () => {
      clearTimers();
      toast.dismiss('inactivity-warning');
      warningTimerRef.current = setTimeout(() => {
        toast.error('You will be logged out due to inactivity', { id: 'inactivity-warning', duration: Infinity });
      }, INACTIVITY_LIMIT - WARNING_TIME);
      timerRef.current = setTimeout(() => {
        toast.dismiss('inactivity-warning');
        logout();
      }, INACTIVITY_LIMIT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimers();
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user, logout]);

  return <>{children}</>;
}
