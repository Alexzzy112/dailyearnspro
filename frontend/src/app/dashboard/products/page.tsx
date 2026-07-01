'use client';
import { useMutation } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiShoppingBag } from 'react-icons/hi';
import toast from 'react-hot-toast';

const products = [
  { name: 'Gold Saver', price: 5000, dailyEarn: 500 },
  { name: 'Diamond Saver', price: 10000, dailyEarn: 1000 },
  { name: 'Premium Saver', price: 20000, dailyEarn: 2000 },
  { name: 'Elite Saver', price: 50000, dailyEarn: 5000 },
  { name: 'Platinum Saver', price: 100000, dailyEarn: 10000 },
  { name: 'Royal Saver', price: 200000, dailyEarn: 20000 },
  { name: 'VIP Saver', price: 500000, dailyEarn: 50000 },
  { name: 'Legend Saver', price: 1000000, dailyEarn: 100000 },
];

export default function ProductsPage() {
  const { user, refreshUser } = useAuth();

  const purchaseMutation = useMutation({
    mutationFn: ({ name, price }: { name: string; price: number }) =>
      userAPI.purchaseProduct(name, price),
    onSuccess: (data: any) => {
      toast.success(data.data?.message || 'Plan purchased!');
      refreshUser();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Purchase failed');
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Investment Plans</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a plan and earn 10% daily on your investment</p>
      </div>

      {user && (
        <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-accent-500 font-medium">Wallet Balance: <span className="font-bold">₦{user.walletBalance?.toLocaleString() || 0}</span></p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((product, i) => (
          <div key={i} className="bg-white dark:bg-secondary-800 rounded-xl p-4 card-shadow hover:shadow-md transition">
            <h3 className="text-sm font-bold text-secondary-700 dark:text-white mb-1">{product.name}</h3>
            <p className="text-xl font-bold text-primary-500 mb-2">₦{product.price.toLocaleString()}</p>
            <div className="bg-accent-500/10 rounded-lg p-2 mb-3">
              <p className="text-[11px] text-accent-500 font-semibold">10% Daily</p>
              <p className="text-sm font-bold text-accent-500">+₦{product.dailyEarn.toLocaleString()}/day</p>
            </div>
            <button
              onClick={() => purchaseMutation.mutate({ name: product.name, price: product.price })}
              disabled={purchaseMutation.isPending}
              className="w-full gradient-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
              {purchaseMutation.isPending ? 'Processing...' : 'Invest'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
