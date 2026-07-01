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
  requestActivation,
  getReferrals,
  getBankInfo,
  submitPayment,
  submitActivationPayment,
  getPayments,
  purchaseProduct,
  getProducts
} = require('../controllers/userController');

router.get('/dashboard', protect, getDashboard);
router.get('/tasks', protect, getTasks);
router.post('/tasks/claim', protect, claimTask);
router.get('/wallet', protect, getWallet);
router.post('/withdraw', protect, requestWithdrawal);
router.post('/request-activation', protect, requestActivation);
router.get('/referrals', protect, getReferrals);
router.get('/bank-info', protect, getBankInfo);
router.post('/payments', protect, upload.single('screenshot'), submitPayment);
router.post('/payments/activation', protect, upload.single('screenshot'), submitActivationPayment);
router.get('/products', protect, getProducts);
router.post('/purchase', protect, purchaseProduct);
router.get('/payments', protect, getPayments);

module.exports = router;
