'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { MotionDiv, scaleIn } from '@/components/MotionComponents';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Login successful!');
      const target = data.role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = target;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md">
          <MotionDiv variants={scaleIn} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue earning</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-primary-500 hover:text-primary-600">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading}
                className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-500 font-medium hover:text-primary-600">Create one</Link>
            </p>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
