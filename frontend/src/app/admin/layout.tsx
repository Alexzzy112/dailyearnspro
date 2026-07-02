'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiChartBar, HiUsers, HiCurrencyDollar, HiCog, HiLogout, HiMenu, HiX, HiCash, HiClipboardList, HiBell, HiShoppingBag, HiChevronDown, HiArrowLeft } from 'react-icons/hi';
import WelcomePopup from '@/components/WelcomePopup';
import NotificationBell from '@/components/NotificationBell';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HiChartBar },
  { href: '/admin/users', label: 'Users', icon: HiUsers },
  { href: '/admin/products', label: 'Products', icon: HiShoppingBag },
  { href: '/admin/tasks', label: 'Tasks', icon: HiClipboardList },
  { href: '/admin/payments', label: 'Payments', icon: HiCash },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: HiCurrencyDollar },
  { href: '/admin/settings', label: 'Settings', icon: HiCog },
  { href: '/admin/notifications', label: 'Notifications', icon: HiBell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">You do not have admin privileges.</p>
          <Link href="/dashboard" className="gradient-primary text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2">
            <HiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <WelcomePopup />

      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl text-secondary-700 dark:text-white">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <NotificationBell />
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-xl px-2 sm:px-3 py-2 transition">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-secondary-700 dark:text-white leading-tight">{user?.name}</p>
                  <p className="text-xs text-purple-500 font-medium">Admin</p>
                </div>
                <HiChevronDown className="hidden sm:block w-4 h-4 text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-fade-in z-50">
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
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-secondary-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 pt-16 lg:pt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30" />}

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
