const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    return await Notification.create({ userId, title, message, type, link });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

const createBulkNotifications = async (userIds, { title, message, type = 'info', link = '' }) => {
  try {
    const notifications = userIds.map(userId => ({ userId, title, message, type, link }));
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Failed to create bulk notifications:', error.message);
  }
};

exports.createNotification = createNotification;
exports.createBulkNotifications = createBulkNotifications;

exports.getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId: req.user._id })
    ]);
    res.json({ notifications, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminGetNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find().populate('userId', 'name username email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments()
    ]);
    res.json({ notifications, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminCreateNotification = async (req, res) => {
  try {
    const { userId, title, message, type, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    if (userId) {
      await createNotification({ userId, title, message, type, link });
      res.status(201).json({ message: 'Notification sent' });
    } else {
      const User = require('../models/User');
      const users = await User.find({}, '_id');
      const userIds = users.map(u => u._id);
      await createBulkNotifications(userIds, { title, message, type, link });
      res.status(201).json({ message: `Notification sent to ${userIds.length} users` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
