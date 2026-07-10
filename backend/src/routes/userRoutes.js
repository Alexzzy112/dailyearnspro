const express = require('express');
const router = express.Router();
const { protect, checkNotSuspended } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDashboard,
  getTasks,
  startTask,
  claimTask,
  getWallet,
  requestWithdrawal,
  getReferrals,
  submitPayment,
  getPayments,
  purchaseProduct,
  getProducts
} = require('../controllers/userController');

router.get('/dashboard', protect, getDashboard);
router.get('/tasks', protect, checkNotSuspended, getTasks);
router.post('/tasks/start', protect, checkNotSuspended, startTask);
router.post('/tasks/claim', protect, checkNotSuspended, claimTask);
router.get('/wallet', protect, checkNotSuspended, getWallet);
router.post('/withdraw', protect, checkNotSuspended, requestWithdrawal);
router.get('/referrals', protect, getReferrals);
router.post('/payments', protect, checkNotSuspended, upload.single('screenshot'), submitPayment);
router.get('/products', protect, getProducts);
router.post('/purchase', protect, checkNotSuspended, purchaseProduct);
router.get('/payments', protect, getPayments);

module.exports = router;
