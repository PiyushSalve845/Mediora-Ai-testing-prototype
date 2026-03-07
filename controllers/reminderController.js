// ============================================
// REMINDER CONTROLLER
// ============================================

const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');

// Get all reminders
const getAllReminders = (req, res) => {
  try {
    const reminders = db.getAllReminders();
    res.json({
      status: 'success',
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching reminders'
    });
  }
};

// Get today's reminders
const getTodayReminders = (req, res) => {
  try {
    const reminders = db.getAllReminders();
    const today = new Date().toISOString().split('T')[0];
    
    const todayReminders = reminders.filter(reminder => {
      const reminderDate = new Date(reminder.scheduledTime).toISOString().split('T')[0];
      return reminderDate === today;
    });

    // Sort by time
    todayReminders.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

    res.json({
      status: 'success',
      count: todayReminders.length,
      data: todayReminders
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching today\'s reminders'
    });
  }
};

// Get upcoming reminders
const getUpcomingReminders = (req, res) => {
  try {
    const reminders = db.getAllReminders();
    const now = new Date();
    
    const upcomingReminders = reminders
      .filter(reminder => {
        const reminderTime = new Date(reminder.scheduledTime);
        return reminderTime > now && reminder.status !== 'taken';
      })
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
      .slice(0, 10);

    res.json({
      status: 'success',
      count: upcomingReminders.length,
      data: upcomingReminders
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching upcoming reminders'
    });
  }
};

// Create new reminder
const createReminder = (req, res) => {
  try {
    const { medicineName, dosage, frequency, times, startDate, endDate, notes } = req.body;

    if (!medicineName || !dosage || !times || times.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Medicine name, dosage, and at least one time are required'
      });
    }

    const reminders = [];
    const start = new Date(startDate || Date.now());
    const end = endDate ? new Date(endDate) : null;

    // Generate reminder instances
    times.forEach(time => {
      const reminder = {
        id: uuidv4(),
        medicineName,
        dosage,
        frequency: frequency || 'daily',
        scheduledTime: combineDateTime(start, time),
        status: 'pending',
        notes: notes || '',
        createdAt: new Date().toISOString()
      };
      reminders.push(reminder);
      db.addReminder(reminder);
    });

    res.status(201).json({
      status: 'success',
      message: 'Reminder(s) created successfully',
      data: reminders
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating reminder'
    });
  }
};

// Helper function to combine date and time
const combineDateTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(':');
  const combined = new Date(date);
  combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return combined.toISOString();
};

// Update reminder
const updateReminder = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const success = db.updateReminder(id, updates);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Reminder not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating reminder'
    });
  }
};

// Mark reminder as taken
const markAsTaken = (req, res) => {
  try {
    const { id } = req.params;
    const takenAt = new Date().toISOString();

    const success = db.updateReminder(id, { 
      status: 'taken', 
      takenAt,
      updatedAt: takenAt
    });

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Reminder not found'
      });
    }

    // Log to analytics
    db.addDailyLog({
      type: 'dose_taken',
      reminderId: id,
      timestamp: takenAt
    });

    res.json({
      status: 'success',
      message: 'Medication marked as taken',
      data: { takenAt }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error marking reminder as taken'
    });
  }
};

// Mark reminder as missed
const markAsMissed = (req, res) => {
  try {
    const { id } = req.params;
    const missedAt = new Date().toISOString();

    const success = db.updateReminder(id, { 
      status: 'missed', 
      missedAt,
      updatedAt: missedAt
    });

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Reminder not found'
      });
    }

    // Log to analytics
    db.addDailyLog({
      type: 'dose_missed',
      reminderId: id,
      timestamp: missedAt
    });

    res.json({
      status: 'success',
      message: 'Medication marked as missed',
      data: { missedAt }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error marking reminder as missed'
    });
  }
};

// Delete reminder
const deleteReminder = (req, res) => {
  try {
    const { id } = req.params;

    const success = db.deleteReminder(id);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Reminder not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting reminder'
    });
  }
};

module.exports = {
  getAllReminders,
  getTodayReminders,
  getUpcomingReminders,
  createReminder,
  updateReminder,
  markAsTaken,
  markAsMissed,
  deleteReminder
};