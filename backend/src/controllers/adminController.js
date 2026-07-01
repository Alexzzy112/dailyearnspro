const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const Setting = require('../models/Setting');
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

exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.accountStatus === 'active') {
      return res.status(400).json({ message: 'User is already active' });
    }
    user.accountStatus = 'active';
    await user.save();
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: 0,
      description: 'Account activated by admin'
    });
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const bonus = Number(process.env.REFERRAL_BONUS) || 50;
        referrer.walletBalance += bonus;
        referrer.totalEarnings += bonus;
        referrer.referralEarnings += bonus;
        referrer.referralCount += 1;
        await referrer.save();
          await Transaction.create({
            userId: referrer._id,
            type: 'credit',
            amount: bonus,
            description: `Referral bonus for referring ${user.name}`
          });
          await createNotification({
            userId: referrer._id, title: 'Referral Bonus Earned!', message: `You earned ₦${bonus} referral bonus for referring ${user.name}!`, type: 'success', link: '/dashboard'
          });
        }
      }
    await createNotification({
      userId: user._id, title: 'Account Activated!', message: 'Your account has been activated by admin. Start earning now!', type: 'success', link: '/dashboard/tasks'
    });
    res.json({ message: 'User activated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.accountStatus = 'suspended';
    await user.save();
    res.json({ message: 'User suspended', user });
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
      dailyTaskLimit: safeNum('dailyTaskLimit', parseInt(process.env.DAILY_TASK_LIMIT) || 10),
      requiredViewingTime: safeNum('requiredViewingTime', parseInt(process.env.REQUIRED_VIEWING_TIME) || 15),
      activationFee: safeNum('activationFee', parseInt(process.env.ACTIVATION_FEE) || 3000),
      minWithdrawal: safeNum('minWithdrawal', parseInt(process.env.MIN_WITHDRAWAL) || 1500),
      referralBonus: safeNum('referralBonus', 50),
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

    if (payment.type === 'activation') {
      user.accountStatus = 'active';
      await user.save();
      await Transaction.create({
        userId: user._id,
        type: 'credit',
        amount: 0,
        description: `Account activated via payment ref: ${payment.reference}`
      });
      if (user.referredBy) {
        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          const bonus = Number(process.env.REFERRAL_BONUS) || 50;
          referrer.walletBalance += bonus;
          referrer.totalEarnings += bonus;
          referrer.referralEarnings += bonus;
          referrer.referralCount += 1;
          await referrer.save();
          await Transaction.create({
            userId: referrer._id,
            type: 'credit',
            amount: bonus,
            description: `Referral bonus for referring ${user.name}`
          });
          await createNotification({
            userId: referrer._id, title: 'Referral Bonus Earned!', message: `You earned ₦${bonus} referral bonus for referring ${user.name}!`, type: 'success', link: '/dashboard'
          });
        }
      }
      await createNotification({
        userId: user._id, title: 'Account Activated!', message: 'Your account has been activated. Start completing tasks and earning rewards!', type: 'success', link: '/dashboard/tasks'
      });
      res.json({ message: 'Activation payment confirmed, account activated', payment });
    } else {
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
    }
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
    if (payment.type === 'activation' && payment.reference?.startsWith('ACT-WALLET-')) {
      const user = await User.findById(payment.userId);
      if (user) {
        user.walletBalance += payment.amount;
        await user.save();
        await Transaction.create({
          userId: user._id,
          type: 'credit',
          amount: payment.amount,
          description: `Refund for rejected activation payment ref: ${payment.reference}`
        });
      }
    }
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
