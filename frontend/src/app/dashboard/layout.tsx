'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiHome, HiClipboardList, HiCurrencyDollar, HiUserGroup, HiLogout, HiCash } from 'react-icons/hi';
import WelcomePopup from '@/components/WelcomePopup';
import NotificationBell from '@/components/NotificationBell';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HiHome },
  { href: '/dashboard/tasks', label: 'Tasks', icon: HiClipboardList },
  { href: '/dashboard/wallet', label: 'Wallet', icon: HiCurrencyDollar },
  { href: '/dashboard/payments', label: 'Payments', icon: HiCash },
  { href: '/dashboard/referrals', label: 'Referrals', icon: HiUserGroup },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <WelcomePopup />
      {/* Top bar with profile + logout */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-secondary-700 dark:text-white">TaskEarn</span>
            <span className="font-bold text-xl text-primary-500">Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-700 dark:text-white leading-tight">{user?.name}</p>
                <p className="text-xs text-accent-500 font-semibold">₦{user?.walletBalance?.toLocaleString()}</p>
              </div>
            </div>
            <NotificationBell />
            <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Logout">
              <HiLogout className="w-5 h-5" />
            </button>
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition min-w-0 ${
                isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}>
              <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
