'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiSparkles, HiStar } from 'react-icons/hi';

export default function WelcomePopup() {
  const { user, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const dismissed = localStorage.getItem('welcomeDismissed');
      if (dismissed !== 'true') {
        setVisible(true);
      }
    }
  }, [user, loading]);

  const handleDismiss = () => {
    localStorage.setItem('welcomeDismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-secondary-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="gradient-primary p-8 text-center relative">
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute top-4 left-4"><HiStar className="w-6 h-6 text-white" /></div>
            <div className="absolute top-4 right-4"><HiStar className="w-6 h-6 text-white" /></div>
            <div className="absolute bottom-4 left-8"><HiStar className="w-4 h-4 text-white" /></div>
            <div className="absolute bottom-4 right-8"><HiStar className="w-4 h-4 text-white" /></div>
          </div>
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 relative">
            <HiSparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h2>
          <p className="text-blue-100 text-sm">Glad to have you on board</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-secondary-700 dark:text-white font-semibold text-lg">
              TaskEarn Pro
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Complete daily tasks and earn real money. Start your earning journey today!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '💰', text: 'Earn daily rewards' },
              { emoji: '🚀', text: 'Instant withdrawals' },
              { emoji: '🎯', text: 'Simple tasks' },
              { emoji: '🔥', text: 'Refer & earn more' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-secondary-700/50 rounded-xl p-3">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm text-secondary-700 dark:text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <button onClick={handleDismiss}
            className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-primary-500/25">
            Let&apos;s Get Started 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
