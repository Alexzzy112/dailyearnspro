import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; username: string; email: string; password: string; referredBy?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

const toFormData = (data: Record<string, any>) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) fd.append(key, val);
  });
  return fd;
};

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getTasks: () => api.get('/user/tasks'),
  claimTask: (taskNumber: number) => api.post('/user/tasks/claim', { taskNumber }),
  getWallet: () => api.get('/user/wallet'),
  requestWithdrawal: (data: { amount: number; bankName: string; accountNumber: string; accountName: string }) =>
    api.post('/user/withdraw', data),
  getReferrals: () => api.get('/user/referrals'),
  getBankInfo: () => api.get('/user/bank-info'),
  submitPayment: (data: { amount: number; reference: string; screenshot?: File }) => {
    const fd = toFormData(data);
    return api.post('/user/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  submitActivationPayment: (data: { screenshot?: File }) => {
    const fd = toFormData(data);
    return api.post('/user/payments/activation', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getPayments: () => api.get('/user/payments'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (search?: string) => api.get(`/admin/users${search ? `?search=${search}` : ''}`),
  activateUser: (id: string) => api.put(`/admin/users/${id}/activate`),
  suspendUser: (id: string) => api.put(`/admin/users/${id}/suspend`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  adjustWallet: (id: string, amount: number, type: 'credit' | 'debit') =>
    api.put(`/admin/users/${id}/wallet`, { amount, type }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: Record<string, any>) => api.put('/admin/settings', data),
  getWithdrawals: () => api.get('/admin/withdrawals'),
  approveWithdrawal: (id: string) => api.put(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id: string) => api.put(`/admin/withdrawals/${id}/reject`),
  markWithdrawalPaid: (id: string) => api.put(`/admin/withdrawals/${id}/paid`),
  deleteWithdrawal: (id: string) => api.delete(`/admin/withdrawals/${id}`),
  getPayments: () => api.get('/admin/payments'),
  confirmPayment: (id: string) => api.put(`/admin/payments/${id}/confirm`),
  rejectPayment: (id: string) => api.put(`/admin/payments/${id}/reject`),
};

export default api;
