const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  activateUser,
  suspendUser,
  deleteUser,
  adjustWallet,
  getSettings,
  updateSettings,
  updateProfile,
  getWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
  deleteWithdrawal,
  getPayments,
  confirmPayment,
  rejectPayment
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/wallet', adjustWallet);
router.put('/profile', updateProfile);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/withdrawals', getWithdrawals);
router.put('/withdrawals/:id/approve', approveWithdrawal);
router.put('/withdrawals/:id/reject', rejectWithdrawal);
router.put('/withdrawals/:id/paid', markWithdrawalPaid);
router.delete('/withdrawals/:id', deleteWithdrawal);
router.get('/payments', getPayments);
router.put('/payments/:id/confirm', confirmPayment);
router.put('/payments/:id/reject', rejectPayment);

module.exports = router;
