const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, referredBy } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      referralCode: username.toLowerCase(),
      accountStatus: 'active'
    });
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy.toLowerCase() });
      if (referrer) {
        user.referredBy = referrer._id;
        await user.save();
      }
    }

    const welcomeSetting = await Setting.findOne({ key: 'welcomeBonus' });
    const welcomeBonus = welcomeSetting ? Number(welcomeSetting.value) : Number(process.env.WELCOME_BONUS) || 500;
    if (welcomeBonus > 0) {
      user.walletBalance += welcomeBonus;
      user.totalEarnings += welcomeBonus;
      await user.save();
      await Transaction.create({
        userId: user._id,
        type: 'credit',
        amount: welcomeBonus,
        description: 'Welcome bonus'
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        tasksCompleted: user.tasksCompleted,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        referralCode: user.referralCode,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.matchPassword(password))) {
      if (user.accountStatus === 'suspended') {
        return res.status(403).json({ message: 'Account suspended. Contact admin.' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        tasksCompleted: user.tasksCompleted,
        todayTasksCompleted: user.todayTasksCompleted,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        referralCode: user.referralCode,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();
    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
