'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { HiOutlineMenu, HiOutlineX, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-secondary-700 dark:text-white">TaskEarn</span>
              <span className="font-bold text-xl text-primary-500">Pro</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition">Dashboard</Link>
                <Link href="/dashboard/tasks" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition">Tasks</Link>
                <Link href="/dashboard/wallet" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition">Withdraw</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition">Admin</Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-accent-500 font-semibold">₦{user.walletBalance?.toLocaleString()}</p>
                  </div>
                  <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition">Home</Link>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition">Login</Link>
                <Link href="/register" className="gradient-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
                  Get Started
                </Link>
              </>
            )}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              {mounted && theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              {mounted && theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/tasks" className="block py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(false)}>Tasks</Link>
                <Link href="/dashboard/wallet" className="block py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(false)}>Withdraw</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block py-2 text-purple-600 font-semibold" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                )}
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="block py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(false)}>Home</Link>
                <Link href="/login" className="block py-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(false)}>Login</Link>
                <Link href="/register" className="block gradient-primary text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
