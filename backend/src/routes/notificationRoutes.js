const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  adminGetNotifications,
  adminCreateNotification
} = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);

router.get('/admin/all', protect, adminOnly, adminGetNotifications);
router.post('/admin/create', protect, adminOnly, adminCreateNotification);

module.exports = router;
