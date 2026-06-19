const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskNumber: { type: Number, required: true },
  reward: { type: Number, default: 5 },
  taskLink: { type: String, default: '' },
  description: { type: String, default: 'Visit the provided link and return to claim your reward.' },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
