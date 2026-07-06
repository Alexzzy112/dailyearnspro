const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  walletBalance: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  accountStatus: { type: String, enum: ['inactive', 'active', 'suspended'], default: 'inactive' },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  totalEarnings: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  todayTasksCompleted: { type: Number, default: 0 },
  completedTaskNumbers: { type: [Number], default: [] },
  lastTaskResetDate: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: Date, default: null },
  referralEarnings: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  purchasedProduct: { type: Boolean, default: false },
  purchasedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  purchasedProductName: { type: String, default: '' },
  productDailyEarn: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateReferralCode = function () {
  return this.username;
};

module.exports = mongoose.model('User', userSchema);
