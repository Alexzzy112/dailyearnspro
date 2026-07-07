'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { MotionDiv, scaleIn } from '@/components/MotionComponents';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function RegisterForm() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', referredBy: ref });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        referredBy: form.referredBy || undefined,
      });
      toast.success('Registration successful! Welcome to TaskEarn Pro.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 pt-16 pb-8">
        <div className="w-full max-w-md">
          <MotionDiv variants={scaleIn} initial="initial" animate="animate" className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Create Account</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Start your earning journey today</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Username</label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                  placeholder="johndoe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                    {showConfirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {ref && (
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                  <p className="text-sm text-primary-600 dark:text-primary-400">Referred by: <strong>{ref}</strong></p>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">Sign in</Link>
            </p>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-secondary-900"><Navbar /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
