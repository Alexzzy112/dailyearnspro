'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error('Missing reset token'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setDone(true);
      toast.success('Password reset successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Set New Password</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your new password</p>
            </div>
            {done ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Your password has been reset successfully.</p>
                <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">Go to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="Min 6 characters" minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Confirm Password</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={loading || !token}
                  className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <p className="text-center">
                  <Link href="/login" className="text-primary-500 text-sm font-medium hover:text-primary-600">Back to Login</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-secondary-900 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
