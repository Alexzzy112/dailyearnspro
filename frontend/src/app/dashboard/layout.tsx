'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { HiHome, HiClipboardList, HiCurrencyDollar, HiLogout, HiShoppingBag, HiChevronDown, HiStar, HiUserGroup } from 'react-icons/hi';
import WelcomePopup from '@/components/WelcomePopup';
import NotificationBell from '@/components/NotificationBell';

const navItems = [
  { href: '/dashboard/products', label: 'Products', icon: HiShoppingBag },
  { href: '/dashboard/tasks', label: 'Tasks', icon: HiClipboardList },
  { href: '/dashboard', label: 'Dashboard', icon: HiHome },
  { href: '/dashboard/referrals', label: 'Referrals', icon: HiUserGroup },
  { href: '/dashboard/top-members', label: 'Top Members', icon: HiStar },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <WelcomePopup />
      {/* Top bar with profile + logout */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-secondary-700 dark:text-white">TaskEarn</span>
            <span className="font-bold text-xl text-primary-500">Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 sm:gap-3 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-xl px-2 sm:px-3 py-2 transition">
                <div className="w-8 h-8 sm:w-9 sm:h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-secondary-700 dark:text-white leading-tight">{user?.name}</p>
                  <p className="text-xs text-accent-500 font-semibold">₦{user?.walletBalance?.toLocaleString()}</p>
                </div>
                <HiChevronDown className="hidden sm:block w-4 h-4 text-gray-400 transition-transform" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                  <button onClick={() => { logout(); setProfileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <HiLogout className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-xs text-gray-500">Log out of your account</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 pt-20 lg:pt-24">
          {children}
        </div>
      </main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto relative gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isDashboard = item.href === '/dashboard';
            if (isDashboard) {
              return (
                <Link key={item.href} href={item.href}
                  className="col-span-1 flex items-center justify-center">
                  <div className={`-mt-7 w-14 h-14 rounded-full flex flex-col items-center justify-center transition shadow-lg ${
                    isActive ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-orange-500/30' : 'bg-white dark:bg-secondary-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600'
                  }`}>
                    <item.icon className="w-6 h-6" />
                    <span className="text-[8px] font-bold mt-0.5">Dashboard</span>
                  </div>
                </Link>
              );
            }
            return (
              <Link key={item.href} href={item.href}
                className={`col-span-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition ${
                  isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
