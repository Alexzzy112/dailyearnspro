const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Payment = require('../models/Payment');
const Setting = require('../models/Setting');
const { createNotification } = require('./notificationController');

const safeEnvNum = (key, fallback) => {
  const v = process.env[key];
  const n = Number(v);
  return isNaN(n) ? fallback : n;
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

    const dailyLimit = safeEnvNum('DAILY_TASK_LIMIT', 10);
    const rewardPerTask = safeEnvNum('REWARD_PER_TASK', 10);
    const tasksRemaining = Math.max(0, dailyLimit - user.todayTasksCompleted);
    const earningsToday = user.todayTasksCompleted * rewardPerTask;

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    const safeNum = (key, fallback) => {
      const v = settingsMap[key];
      return v !== undefined && v !== null ? Number(v) : fallback;
    };

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
        createdAt: user.createdAt
      },
      settings: {
        taskLink: settingsMap.taskLink || process.env.DEFAULT_TASK_LINK,
        rewardPerTask: safeNum('rewardPerTask', rewardPerTask),
        dailyTaskLimit: safeNum('dailyTaskLimit', dailyLimit),
        requiredViewingTime: safeNum('requiredViewingTime', safeEnvNum('REQUIRED_VIEWING_TIME', 15)),
        minWithdrawal: safeNum('minWithdrawal', safeEnvNum('MIN_WITHDRAWAL', 1500)),
        activationFee: safeNum('activationFee', safeEnvNum('ACTIVATION_FEE', 2000))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account not activated' });
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
    const dailyLimit = safeNum('dailyTaskLimit', safeEnvNum('DAILY_TASK_LIMIT', 10));
    const reward = safeNum('rewardPerTask', safeEnvNum('REWARD_PER_TASK', 10));
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

    res.json({ tasks, todayCompleted: user.todayTasksCompleted, dailyLimit, taskTitle, taskDescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.claimTask = async (req, res) => {
  try {
    const { taskNumber } = req.body;
    if (!taskNumber || taskNumber < 1 || typeof taskNumber !== 'number') {
      return res.status(400).json({ message: 'Invalid task number' });
    }
    const user = await User.findById(req.user._id);
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: 'Account not activated' });
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
    const dailyLimit = safeNum('dailyTaskLimit', safeEnvNum('DAILY_TASK_LIMIT', 10));
    const reward = safeNum('rewardPerTask', safeEnvNum('REWARD_PER_TASK', 10));

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

    const settings = await Setting.findOne({ key: 'minWithdrawal' });
    const minWithdrawal = settings ? Number(settings.value) : safeEnvNum('MIN_WITHDRAWAL', 1500);

    if (amount < minWithdrawal) {
      return res.status(400).json({ message: `Minimum withdrawal is ₦${minWithdrawal}` });
    }
    if (amount > user.walletBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const day = new Date().getDay();
    if (![1, 3, 5].includes(day)) {
      return res.status(400).json({ message: 'Withdrawals only on Monday, Wednesday, and Friday' });
    }

    const withdrawal = await Withdrawal.create({
      userId: user._id,
      amount,
      bankName,
      accountNumber,
      accountName
    });

    user.walletBalance -= amount;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount,
      description: `Withdrawal request #${withdrawal._id}`
    });

    await createNotification({
      userId: user._id, title: 'Withdrawal Submitted', message: `Your withdrawal request of ₦${amount} has been submitted and is pending approval.`, type: 'info', link: '/dashboard/wallet'
    });
    res.status(201).json({ message: 'Withdrawal request submitted', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestActivation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.accountStatus !== 'inactive') {
      return res.status(400).json({ message: 'Account is already active or suspended' });
    }
    const settings = await Setting.findOne({ key: 'activationFee' });
    const fee = settings ? Number(settings.value) : safeEnvNum('ACTIVATION_FEE', 3000);
    if (user.walletBalance < fee) {
      return res.status(400).json({ message: `Insufficient balance. Activation fee is ₦${fee}.` });
    }
    user.walletBalance -= fee;
    await user.save();
    await Transaction.create({
      userId: user._id,
      type: 'debit',
      amount: fee,
      description: `Activation fee payment of ₦${fee}`
    });
    await Payment.create({
      userId: user._id,
      amount: fee,
      reference: `ACT-WALLET-${user._id}-${Date.now()}`,
      type: 'activation'
    });
    res.json({ message: 'Activation request submitted. Admin will review and approve.' });
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

exports.getBankInfo = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    res.json({
      bankName: settingsMap.bankName || '',
      accountNumber: settingsMap.accountNumber || '',
      accountName: settingsMap.accountName || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitActivationPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.accountStatus !== 'inactive') {
      return res.status(400).json({ message: 'Account is already active or suspended' });
    }
    const settings = await Setting.findOne({ key: 'activationFee' });
    const fee = settings ? Number(settings.value) : safeEnvNum('ACTIVATION_FEE', 3000);

    const ref = reference && reference.trim() ? reference.trim() : `ACT-${user._id}-${Date.now()}`;
    const screenshot = req.file ? req.file.path : '';
    const payment = await Payment.create({
      userId: req.user._id,
      amount: fee,
      reference: ref,
      type: 'activation',
      screenshot
    });
    res.status(201).json({ message: 'Activation payment submitted. Awaiting admin approval.', payment });
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

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
