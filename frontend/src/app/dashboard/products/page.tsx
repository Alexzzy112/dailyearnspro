'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import CarImage from '@/components/CarImages';
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from '@/components/MotionComponents';
import toast from 'react-hot-toast';
import { HiShoppingBag, HiTrendingUp, HiCheckCircle, HiArrowRight } from 'react-icons/hi';

const planGradients = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
];

export default function ProductsPage() {
  const { user, refreshUser } = useAuth();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => userAPI.getProducts().then(r => r.data),
  });

  const purchaseMutation = useMutation({
    mutationFn: ({ name, price }: { name: string; price: number }) =>
      userAPI.purchaseProduct(name, price),
    onSuccess: (data: any) => {
      toast.success(data.data?.message || 'Plan purchased!');
      setPurchasingId(null);
      refreshUser();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Purchase failed');
      setPurchasingId(null);
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Investment Plans</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Choose a plan and earn daily returns on your investment</p>
      </div>

      {user && (
        <MotionDiv variants={fadeInUp(0.05)} initial="initial" animate="animate" className="mb-6 card-pro p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
              <HiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Wallet Balance</p>
              <p className="text-lg font-bold text-secondary-700 dark:text-white">₦{user.walletBalance?.toLocaleString() || 0}</p>
            </div>
            {user.purchasedProduct && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                <HiCheckCircle className="w-3.5 h-3.5" /> Active Plan
              </span>
            )}
          </div>
        </MotionDiv>
      )}

      <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map((product: any, idx: number) => {
          const gradient = planGradients[idx % planGradients.length];
          const isOwned = user?.purchasedProductId === product._id;
          return (
            <MotionDiv key={product._id} variants={staggerItem} className="card-pro overflow-hidden group">
              <div className={`bg-gradient-to-r ${gradient} relative`}>
                <CarImage price={product.price} className="w-full" />
                <div className="px-4 pb-3">
                  <p className="text-sm font-semibold text-white/90">{product.name}</p>
                  <p className="text-xl font-bold text-white">₦{product.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="bg-gradient-to-r from-accent-500/10 to-accent-500/5 rounded-xl p-4 mb-4 border border-accent-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <HiTrendingUp className="w-4 h-4 text-accent-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Earnings</p>
                  </div>
                  <p className="text-lg font-bold text-accent-500">+₦{product.dailyEarn?.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{product.dailyEarnPercent || 10}% of investment</p>
                </div>
                {isOwned ? (
                  <div className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2.5 rounded-xl text-sm font-semibold border border-green-200 dark:border-green-800">
                    <HiCheckCircle className="w-4 h-4" /> Active
                  </div>
                ) : (
                  <button
                    onClick={() => { setPurchasingId(product._id); purchaseMutation.mutate({ name: product.name, price: product.price }); }}
                    disabled={purchasingId === product._id}
                    className="w-full flex items-center justify-center gap-2 gradient-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50">
                    {purchasingId === product._id ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><HiArrowRight className="w-4 h-4" /> Invest Now</>
                    )}
                  </button>
                )}
              </div>
            </MotionDiv>
          );
        })}
        {(!products || products.length === 0) && (
          <MotionDiv variants={staggerItem} className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <HiShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No investment plans available</p>
          </MotionDiv>
        )}
      </MotionDiv>
    </div>
  );
}
