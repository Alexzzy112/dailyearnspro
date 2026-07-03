const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Payment = require('../models/Payment');
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');

const safeEnvNum = (key, fallback) => {
  const v = process.env[key];
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

const getNigeriaDay = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 60 * 60000).getUTCDay();
};

const hasTaskAccess = async (userId) => {
  const user = await User.findById(userId).select('purchasedProduct');
  return user?.purchasedProduct === true;
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!user.lastTaskResetDate || user.lastTaskResetDate < today) {
      user.todayTasksCompleted = 0;
      user.completedTaskNumbers = [];
      user.lastTaskResetDate = new Date();
      await user.save();
    }

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    const safeNum = (key, fallback) => {
      const v = settingsMap[key];
      return v !== undefined && v !== null ? Number(v) : fallback;
    };
    const dailyLimit = safeNum('dailyTaskLimit', safeEnvNum('DAILY_TASK_LIMIT', 100));
    const rewardPerTask = user.productDailyEarn ? Math.round(user.productDailyEarn / dailyLimit) : safeNum('rewardPerTask', safeEnvNum('REWARD_PER_TASK', 10));
    const tasksRemaining = Math.max(0, dailyLimit - user.todayTasksCompleted);
    const earningsToday = user.todayTasksCompleted * rewardPerTask;
    const access = await hasTaskAccess(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        walletBalance: user.walletBalance,
        accountStatus: user.accountStatus,
        tasksCompleted: user.tasksCompleted,
        todayTasksCompleted: user.todayTasksCompleted,
        tasksRemaining,
        earningsToday,
        totalEarnings: user.totalEarnings,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
        hasTaskAccess: access
      },
      settings: {
        taskLink: settingsMap.taskLink || process.env.DEFAULT_TASK_LINK,
        rewardPerTask,
        dailyTaskLimit: dailyLimit,
        requiredViewingTime: safeNum('requiredViewingTime', safeEnvNum('REQUIRED_VIEWING_TIME', 15)),
        minWithdrawal: safeNum('minWithdrawal', safeEnvNum('MIN_WITHDRAWAL', 1500)),
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const day = getNigeriaDay();
    if (day === 0 || day === 6) {
      return res.json({ tasks: [], todayCompleted: 0, dailyLimit: 0, tasksAvailable: false, message: 'Tasks are only available Monday to Friday. Come back on a weekday!' });
    }

    const user = await User.findById(req.user._id);
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account is suspended or inactive' });
    }

    const access = await hasTaskAccess(user._id);
    if (!access) {
      return res.status(403).json({ message: 'Purchase an investment plan to unlock daily tasks', locked: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!user.lastTaskResetDate || user.lastTaskResetDate < today) {
      user.todayTasksCompleted = 0;
      user.completedTaskNumbers = [];
      user.lastTaskResetDate = new Date();
      await user.save();
    }

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });

    const safeNum = (key, fallback) => {
      const v = settingsMap[key];
      return v !== undefined && v !== null ? Number(v) : fallback;
    };
    const taskLink = settingsMap.taskLink || process.env.DEFAULT_TASK_LINK;
    const taskTitle = settingsMap.taskTitle || 'Visit Sponsor';
    const taskDescription = settingsMap.taskDescription || 'Click the link below, wait the required time, then claim your reward.';
    const dailyLimit = safeNum('dailyTaskLimit', safeEnvNum('DAILY_TASK_LIMIT', 100));
    const reward = user.productDailyEarn ? Math.round(user.productDailyEarn / dailyLimit) : safeNum('rewardPerTask', safeEnvNum('REWARD_PER_TASK', 10));
    const viewTime = safeNum('requiredViewingTime', safeEnvNum('REQUIRED_VIEWING_TIME', 15));

    const completedSet = new Set(user.completedTaskNumbers || []);
    const tasks = [];
    for (let i = 1; i <= dailyLimit; i++) {
      tasks.push({
        taskNumber: i,
        title: taskTitle,
        reward,
        taskLink,
        description: taskDescription,
        completed: completedSet.has(i),
        requiredViewingTime: viewTime
      });
    }

    res.json({ tasks, todayCompleted: user.todayTasksCompleted, dailyLimit, taskTitle, taskDescription, tasksAvailable: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.claimTask = async (req, res) => {
  try {
    const day = getNigeriaDay();
    if (day === 0 || day === 6) {
      return res.status(400).json({ message: 'Tasks can only be completed Monday to Friday' });
    }

    const { taskNumber } = req.body;
    if (!taskNumber || taskNumber < 1 || typeof taskNumber !== 'number') {
      return res.status(400).json({ message: 'Invalid task number' });
    }
    const user = await User.findById(req.user._id);
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account is suspended or inactive' });
    }

    const access = await hasTaskAccess(user._id);
    if (!access) {
      return res.status(403).json({ message: 'Purchase an investment plan to unlock daily tasks' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!user.lastTaskResetDate || user.lastTaskResetDate < today) {
      user.todayTasksCompleted = 0;
      user.completedTaskNumbers = [];
      user.lastTaskResetDate = new Date();
      await user.save();
    }

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    const safeNum = (key, fallback) => {
      const v = settingsMap[key];
      return v !== undefined && v !== null ? Number(v) : fallback;
    };
    const dailyLimit = safeNum('dailyTaskLimit', safeEnvNum('DAILY_TASK_LIMIT', 100));
    const reward = user.productDailyEarn ? Math.round(user.productDailyEarn / dailyLimit) : safeNum('rewardPerTask', safeEnvNum('REWARD_PER_TASK', 10));

    if (!Number.isInteger(taskNumber) || taskNumber < 1 || taskNumber > dailyLimit) {
      return res.status(400).json({ message: 'Invalid task number' });
    }
    const completedSet = new Set(user.completedTaskNumbers || []);
    if (completedSet.has(taskNumber)) {
      return res.status(400).json({ message: 'Task already completed' });
    }
    if (user.todayTasksCompleted >= dailyLimit) {
      return res.status(400).json({ message: 'Daily task limit reached' });
    }

    user.completedTaskNumbers = [...completedSet, taskNumber];
    user.walletBalance += reward;
    user.totalEarnings += reward;
    user.tasksCompleted += 1;
    user.todayTasksCompleted += 1;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: reward,
      description: `Reward for completing task #${taskNumber}`
    });

    res.json({
      message: `₦${reward} added to wallet`,
      walletBalance: user.walletBalance,
      todayTasksCompleted: user.todayTasksCompleted,
      tasksCompleted: user.tasksCompleted,
      totalEarnings: user.totalEarnings
    });
    if (user.todayTasksCompleted === 1) {
      await createNotification({
        userId: user._id, title: 'First Task Done!', message: `Congratulations on completing your first task! ₦${reward} has been added to your wallet.`, type: 'success', link: '/dashboard/tasks'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance totalEarnings');
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const withdrawals = await Withdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    const minWithdrawal = settingsMap.minWithdrawal ? Number(settingsMap.minWithdrawal) : safeEnvNum('MIN_WITHDRAWAL', 1500);

    res.json({
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      minWithdrawal,
      bankInfo: {
        bankName: settingsMap.bankName || '',
        accountNumber: settingsMap.accountNumber || '',
        accountName: settingsMap.accountName || ''
      },
      transactions,
      withdrawals,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;
    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'All withdrawal fields are required' });
    }
    const user = await User.findById(req.user._id);
    if (!user || user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account must be active to withdraw' });
    }
    if (!user.purchasedProduct) {
      return res.status(403).json({ message: 'Purchase an investment plan to unlock withdrawals' });
    }

    const settings = await Setting.findOne({ key: 'minWithdrawal' });
    const minWithdrawal = settings ? Number(settings.value) : safeEnvNum('MIN_WITHDRAWAL', 1500);

    if (amount < minWithdrawal) {
      return res.status(400).json({ message: `Minimum withdrawal is ₦${minWithdrawal}` });
    }
    if (amount > user.walletBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const wdChargeSetting = await Setting.findOne({ key: 'withdrawalCharge' });
    const wdChargePercent = wdChargeSetting ? Number(wdChargeSetting.value) : 0;
    const charge = Math.round(amount * (wdChargePercent / 100));
    const totalDeduction = amount + charge;

    if (totalDeduction > user.walletBalance) {
      return res.status(400).json({ message: `Insufficient balance including ₦${charge} withdrawal fee (${wdChargePercent}%)` });
    }

    const day = getNigeriaDay();
    if (day !== 5) {
      return res.status(400).json({ message: 'Withdrawals are only available on Friday' });
    }

    const withdrawal = await Withdrawal.create({
      userId: user._id,
      amount,
      bankName,
      accountNumber,
      accountName
    });

    user.walletBalance -= totalDeduction;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount: totalDeduction,
      description: `Withdrawal request #${withdrawal._id}${charge ? ` (incl. ₦${charge} fee)` : ''}`
    });

    await createNotification({
      userId: user._id, title: 'Withdrawal Submitted', message: `Your withdrawal request of ₦${amount} has been submitted and is pending approval.`, type: 'info', link: '/dashboard/wallet'
    });
    res.status(201).json({ message: 'Withdrawal request submitted', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const referrals = await User.find({ referredBy: req.user._id })
      .select('name username email createdAt totalEarnings')
      .sort({ createdAt: -1 });
    res.json({ referrals, count: referrals.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitPayment = async (req, res) => {
  try {
    const { amount, reference } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const ref = reference && reference.trim() ? reference.trim() : `PAY-${req.user._id}-${Date.now()}`;
    const screenshot = req.file ? req.file.path : '';
    const payment = await Payment.create({
      userId: req.user._id,
      amount: Number(amount),
      reference: ref,
      screenshot
    });
    res.status(201).json({ message: 'Payment notification submitted. Awaiting confirmation.', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.purchaseProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price || price <= 0) {
      return res.status(400).json({ message: 'Invalid product' });
    }
    const user = await User.findById(req.user._id);
    if (user.walletBalance < price) {
      return res.status(400).json({ message: `Insufficient funds. You need ₦${price.toLocaleString()} but have ₦${user.walletBalance.toLocaleString()}` });
    }
    const product = await Product.findOne({ name, active: true });
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }
    const isFirstPurchase = !user.purchasedProduct;
    user.walletBalance -= price;
    user.purchasedProduct = true;
    user.productDailyEarn = product.dailyEarn;
    await user.save();
    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount: price,
      description: `Purchased ${name} plan for ₦${price.toLocaleString()}`
    });

    if (isFirstPurchase && user.referredBy) {
      const refSetting = await Setting.findOne({ key: 'referralBonusPercent' });
      const refPercent = refSetting ? Number(refSetting.value) : 30;
      const bonus = Math.round(price * (refPercent / 100));
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referrer.walletBalance += bonus;
        referrer.totalEarnings += bonus;
        referrer.referralEarnings += bonus;
        referrer.referralCount += 1;
        await referrer.save();
        await Transaction.create({
          userId: referrer._id,
          type: 'credit',
          amount: bonus,
          description: `${refPercent}% referral bonus for referring ${user.name}'s ${name} purchase`
        });
        await createNotification({
          userId: referrer._id, title: 'Referral Bonus Earned!', message: `You earned ₦${bonus.toLocaleString()} (${refPercent}%) from ${user.name}'s ${name} purchase!`, type: 'success', link: '/dashboard'
        });
      }
    }

    await createNotification({
      userId: user._id, title: 'Investment Activated!', message: `You've successfully purchased the ${name} plan. Start earning daily returns now!`, type: 'success', link: '/dashboard/products'
    });
    res.json({ message: `${name} plan purchased successfully!`, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ price: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
