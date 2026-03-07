// ============================================
// REMINDER ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Get all reminders
router.get('/', reminderController.getAllReminders);

// Get reminders for today
router.get('/today', reminderController.getTodayReminders);

// Get upcoming reminders
router.get('/upcoming', reminderController.getUpcomingReminders);

// Create new reminder
router.post('/', reminderController.createReminder);

// Update reminder
router.put('/:id', reminderController.updateReminder);

// Mark reminder as taken
router.patch('/:id/taken', reminderController.markAsTaken);

// Mark reminder as missed
router.patch('/:id/missed', reminderController.markAsMissed);

// Delete reminder
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;