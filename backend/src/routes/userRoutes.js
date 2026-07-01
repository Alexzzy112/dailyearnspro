const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDashboard,
  getTasks,
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
router.get('/tasks', protect, getTasks);
router.post('/tasks/claim', protect, claimTask);
router.get('/wallet', protect, getWallet);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/referrals', protect, getReferrals);
router.post('/payments', protect, upload.single('screenshot'), submitPayment);
router.get('/products', protect, getProducts);
router.post('/purchase', protect, purchaseProduct);
router.get('/payments', protect, getPayments);

module.exports = router;
