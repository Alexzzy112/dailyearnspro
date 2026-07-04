const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const { createNotification, createBulkNotifications } = require('./notificationController');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ accountStatus: 'active' });
    const inactiveUsers = await User.countDocuments({ accountStatus: 'inactive' });
    const totalTasksCompleted = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$tasksCompleted' } } }
    ]);
    const totalEarnings = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const totalWithdrawals = await Withdrawal.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paidWithdrawals = await Withdrawal.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTasksCompleted: totalTasksCompleted[0]?.total || 0,
      totalEarnings: totalEarnings[0]?.total || 0,
      pendingWithdrawals,
      totalWithdrawals: totalWithdrawals[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      paidWithdrawals: paidWithdrawals[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'user' };
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { username: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } }
      ];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newStatus = user.accountStatus === 'suspended' ? 'active' : 'suspended';
    user.accountStatus = newStatus;
    await user.save();
    res.json({ message: `User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referrer.referralCount = Math.max(0, referrer.referralCount - 1);
        await referrer.save();
      }
    }
    await User.findByIdAndDelete(req.params.id);
    await Transaction.deleteMany({ userId: req.params.id });
    await Withdrawal.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adjustWallet = async (req, res) => {
  try {
    const { amount, type } = req.body;
    if (!amount || amount <= 0 || typeof amount !== 'number' || !Number.isFinite(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (type === 'credit') {
      user.walletBalance += amount;
    } else {
      if (user.walletBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.walletBalance -= amount;
    }
    await user.save();
    await Transaction.create({
      userId: user._id,
      type,
      amount,
      description: `Admin ${type} of ₦${amount}`
    });
    res.json({ message: 'Wallet updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    const safeNum = (key, fallback) => {
      const v = settingsMap[key];
      return v !== undefined && v !== null ? Number(v) : fallback;
    };
    res.json({
      taskLink: settingsMap.taskLink || process.env.DEFAULT_TASK_LINK,
      rewardPerTask: safeNum('rewardPerTask', parseInt(process.env.REWARD_PER_TASK) || 10),
      dailyTaskLimit: safeNum('dailyTaskLimit', parseInt(process.env.DAILY_TASK_LIMIT) || 100),
      requiredViewingTime: safeNum('requiredViewingTime', parseInt(process.env.REQUIRED_VIEWING_TIME) || 15),
      minWithdrawal: safeNum('minWithdrawal', parseInt(process.env.MIN_WITHDRAWAL) || 1500),
      referralBonus: safeNum('referralBonus', 50),
      referralBonusPercent: safeNum('referralBonusPercent', 30),
      withdrawalCharge: safeNum('withdrawalCharge', 5),
      welcomeBonus: safeNum('welcomeBonus', parseInt(process.env.WELCOME_BONUS) || 500),
      bankName: settingsMap.bankName || '',
      accountNumber: settingsMap.accountNumber || '',
      accountName: settingsMap.accountName || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate('userId', 'name username email')
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    withdrawal.status = 'approved';
    await withdrawal.save();
    await createNotification({
      userId: withdrawal.userId, title: 'Withdrawal Approved', message: `Your withdrawal of ₦${withdrawal.amount} has been approved and is being processed.`, type: 'success', link: '/dashboard/wallet'
    });
    res.json({ message: 'Withdrawal approved', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    withdrawal.status = 'rejected';
    await withdrawal.save();
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.walletBalance += withdrawal.amount;
      await user.save();
      await Transaction.create({
        userId: user._id,
        type: 'credit',
        amount: withdrawal.amount,
        description: `Refund for rejected withdrawal #${withdrawal._id}`
      });
      await createNotification({
        userId: user._id, title: 'Withdrawal Rejected', message: `Your withdrawal of ₦${withdrawal.amount} has been rejected. Funds have been returned to your wallet.`, type: 'error', link: '/dashboard/wallet'
      });
    }
    res.json({ message: 'Withdrawal rejected, funds returned', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markWithdrawalPaid = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    withdrawal.status = 'paid';
    await withdrawal.save();
    await createNotification({
      userId: withdrawal.userId, title: 'Withdrawal Paid!', message: `Your withdrawal of ₦${withdrawal.amount} has been paid out successfully.`, type: 'success', link: '/dashboard/wallet'
    });
    res.json({ message: 'Withdrawal marked as paid', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    if (withdrawal.status === 'pending' || withdrawal.status === 'rejected') {
      const user = await User.findById(withdrawal.userId);
      if (user) {
        user.walletBalance += withdrawal.amount;
        await user.save();
        await Transaction.create({
          userId: user._id,
          type: 'credit',
          amount: withdrawal.amount,
          description: `Refund for deleted withdrawal #${withdrawal._id}`
        });
      }
    }
    await Withdrawal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Withdrawal deleted, funds refunded if applicable' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.revertWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    if (withdrawal.status === 'pending') {
      return res.status(400).json({ message: 'Cannot revert a pending withdrawal' });
    }
    if (withdrawal.status === 'rejected') {
      return res.status(400).json({ message: 'Cannot revert a rejected withdrawal' });
    }
    const wasPaid = withdrawal.status === 'paid';
    withdrawal.status = 'pending';
    await withdrawal.save();
    if (wasPaid) {
      const user = await User.findById(withdrawal.userId);
      if (user) {
        user.walletBalance += withdrawal.amount;
        await user.save();
        await Transaction.create({
          userId: user._id,
          type: 'credit',
          amount: withdrawal.amount,
          description: `Refund for reverted paid withdrawal #${withdrawal._id}`
        });
        await createNotification({
          userId: user._id, title: 'Withdrawal Reverted', message: `Your paid withdrawal of ₦${withdrawal.amount} has been reverted. Funds have been returned to your wallet.`, type: 'info', link: '/dashboard/wallet'
        });
      }
    } else {
      await createNotification({
        userId: withdrawal.userId, title: 'Withdrawal Reverted', message: `Your approved withdrawal of ₦${withdrawal.amount} has been reverted back to pending.`, type: 'info', link: '/dashboard/wallet'
      });
    }
    res.json({ message: 'Withdrawal reverted to pending', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.revertAllWithdrawals = async (req, res) => {
  try {
    const targetStatuses = ['approved', 'paid'];
    const withdrawals = await Withdrawal.find({ status: { $in: targetStatuses } });
    let revertedCount = 0;
    let refundedCount = 0;
    for (const withdrawal of withdrawals) {
      const wasPaid = withdrawal.status === 'paid';
      withdrawal.status = 'pending';
      await withdrawal.save();
      revertedCount++;
      if (wasPaid) {
        const user = await User.findById(withdrawal.userId);
        if (user) {
          user.walletBalance += withdrawal.amount;
          await user.save();
          await Transaction.create({
            userId: user._id,
            type: 'credit',
            amount: withdrawal.amount,
            description: `Refund for reverted paid withdrawal #${withdrawal._id}`
          });
          refundedCount++;
        }
      }
      await createNotification({
        userId: withdrawal.userId, title: 'Withdrawal Reverted', message: `Your ${wasPaid ? 'paid' : 'approved'} withdrawal of ₦${withdrawal.amount} has been reverted back to pending.`, type: 'info', link: '/dashboard/wallet'
      });
    }
    res.json({ message: `Reverted ${revertedCount} withdrawal(s)${refundedCount ? `, refunded ${refundedCount}` : ''}`, revertedCount, refundedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name username email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }
    payment.status = 'confirmed';
    await payment.save();
    const user = await User.findById(payment.userId._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += payment.amount;
    await user.save();
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: payment.amount,
      description: `Wallet funded - payment ref: ${payment.reference}`
    });
    await createNotification({
      userId: user._id, title: 'Payment Confirmed', message: `Your payment of ₦${payment.amount} has been confirmed. Wallet credited!`, type: 'success', link: '/dashboard/wallet'
    });
    res.json({ message: 'Payment confirmed, wallet credited', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }
    payment.status = 'rejected';
    await payment.save();
    await createNotification({
      userId: payment.userId, title: 'Payment Rejected', message: `Your payment of ₦${payment.amount} has been rejected. Contact admin for details.`, type: 'error', link: '/dashboard/payments'
    });
    res.json({ message: 'Payment rejected', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetRecords = async (req, res) => {
  try {
    await Transaction.deleteMany({});
    await Payment.deleteMany({});
    await Withdrawal.deleteMany({});
    res.json({ message: 'All records reset. Users unaffected.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reseedData = async (req, res) => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Transaction.deleteMany({});
    await Payment.deleteMany({});
    await Withdrawal.deleteMany({});
    res.json({ message: 'All user data wiped. Admin account preserved.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find().sort({ price: 1 });
    if (products.length === 0) {
      const defaults = [
        { name: 'Gold Saver', price: 5000, dailyEarn: 500, dailyEarnPercent: 10 },
        { name: 'Diamond Saver', price: 10000, dailyEarn: 1000, dailyEarnPercent: 10 },
        { name: 'Premium Saver', price: 20000, dailyEarn: 2000, dailyEarnPercent: 10 },
        { name: 'Elite Saver', price: 50000, dailyEarn: 5000, dailyEarnPercent: 10 },
        { name: 'Platinum Saver', price: 100000, dailyEarn: 10000, dailyEarnPercent: 10 },
        { name: 'Royal Saver', price: 200000, dailyEarn: 20000, dailyEarnPercent: 10 },
        { name: 'VIP Saver', price: 500000, dailyEarn: 50000, dailyEarnPercent: 10 },
        { name: 'Legend Saver', price: 1000000, dailyEarn: 100000, dailyEarnPercent: 10 },
      ];
      products = await Product.insertMany(defaults);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, dailyEarnPercent } = req.body;
    if (!name || !price || !dailyEarnPercent) return res.status(400).json({ message: 'Name, price, and daily earn % are required' });
    const dailyEarn = Math.round(price * (Number(dailyEarnPercent) / 100));
    const product = await Product.create({ name, price, dailyEarn, dailyEarnPercent: Number(dailyEarnPercent) });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.dailyEarnPercent || updateData.price) {
      const current = await Product.findById(req.params.id);
      const price = updateData.price || current.price;
      const percent = updateData.dailyEarnPercent || current.dailyEarnPercent;
      updateData.dailyEarn = Math.round(price * (Number(percent) / 100));
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
