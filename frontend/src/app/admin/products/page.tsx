'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiShoppingBag } from 'react-icons/hi';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', price: '', dailyEarn: '' });

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => adminAPI.getProducts().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => adminAPI.createProduct({ name: form.name, price: Number(form.price), dailyEarn: Number(form.dailyEarn) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product created'); setShowForm(false); setForm({ name: '', price: '', dailyEarn: '' }); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: () => adminAPI.updateProduct(editing._id, { name: form.name, price: Number(form.price), dailyEarn: Number(form.dailyEarn) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product updated'); setEditing(null); setShowForm(false); setForm({ name: '', price: '', dailyEarn: '' }); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteProduct(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); toast.success('Product deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const openCreate = () => { setEditing(null); setForm({ name: '', price: '', dailyEarn: '' }); setShowForm(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, price: String(p.price), dailyEarn: String(p.dailyEarn) }); setShowForm(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.dailyEarn) return toast.error('All fields required');
    if (editing) updateMutation.mutate(); else createMutation.mutate();
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Product Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{products?.length || 0} investment plans</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition">
          <HiPlus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Price</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Daily Earn</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p: any) => (
                <tr key={p._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-secondary-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                        <HiShoppingBag className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-secondary-700 dark:text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-secondary-700 dark:text-white">₦{p.price?.toLocaleString()}</td>
                  <td className="py-4 px-4 font-semibold text-accent-500">₦{p.dailyEarn?.toLocaleString()}/day</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Edit">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p._id); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Plan Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Price (₦)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Daily Earn (₦)</label>
                <input type="number" value={form.dailyEarn} onChange={(e) => setForm({ ...form, dailyEarn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
