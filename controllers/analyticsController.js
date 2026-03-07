// ============================================
// ANALYTICS CONTROLLER
// ============================================

const db = require('../utils/database');

// Get overall analytics
const getOverallAnalytics = (req, res) => {
  try {
    const reminders = db.getAllReminders();
    const analytics = db.getAnalytics() || {};

    const totalDoses = reminders.length;
    const takenDoses = reminders.filter(r => r.status === 'taken').length;
    const missedDoses = reminders.filter(r => r.status === 'missed').length;
    const pendingDoses = reminders.filter(r => r.status === 'pending').length;
    const adherencePercentage = totalDoses > 0 ? Math.round((takenDoses / (takenDoses + missedDoses || 1)) * 100) : 100;

    // Calculate streak
    let currentStreak = 0;
    const sortedReminders = reminders
      .filter(r => r.status === 'taken' || r.status === 'missed')
      .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    
    for (const reminder of sortedReminders) {
      if (reminder.status === 'taken') {
        currentStreak++;
      } else {
        break;
      }
    }

    res.json({
      status: 'success',
      data: {
        totalDoses,
        takenDoses,
        missedDoses,
        pendingDoses,
        adherencePercentage,
        currentStreak,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching analytics'
    });
  }
};

// Get daily analytics
const getDailyAnalytics = (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const dateString = targetDate.toISOString().split('T')[0];

    const reminders = db.getAllReminders();
    const dayReminders = reminders.filter(r => {
      const reminderDate = new Date(r.scheduledTime).toISOString().split('T')[0];
      return reminderDate === dateString;
    });

    const taken = dayReminders.filter(r => r.status === 'taken').length;
    const missed = dayReminders.filter(r => r.status === 'missed').length;
    const pending = dayReminders.filter(r => r.status === 'pending').length;

    res.json({
      status: 'success',
      data: {
        date: dateString,
        total: dayReminders.length,
        taken,
        missed,
        pending,
        adherencePercentage: dayReminders.length > 0 
          ? Math.round((taken / (taken + missed || 1)) * 100) 
          : 100,
        schedule: dayReminders.map(r => ({
          id: r.id,
          medicineName: r.medicineName,
          time: new Date(r.scheduledTime).toLocaleTimeString(),
          status: r.status
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching daily analytics'
    });
  }
};

// Get weekly analytics
const getWeeklyAnalytics = (req, res) => {
  try {
    const reminders = db.getAllReminders();
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayReminders = reminders.filter(r => {
        const reminderDate = new Date(r.scheduledTime).toISOString().split('T')[0];
        return reminderDate === dateString;
      });

      const taken = dayReminders.filter(r => r.status === 'taken').length;
      const missed = dayReminders.filter(r => r.status === 'missed').length;

      weekData.push({
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        taken,
        missed,
        total: dayReminders.length,
        adherencePercentage: (taken + missed) > 0 
          ? Math.round((taken / (taken + missed)) * 100) 
          : 100
      });
    }

    // Calculate weekly average
    const totalTaken = weekData.reduce((sum, d) => sum + d.taken, 0);
    const totalMissed = weekData.reduce((sum, d) => sum + d.missed, 0);
    const weeklyAverage = (totalTaken + totalMissed) > 0 
      ? Math.round((totalTaken / (totalTaken + totalMissed)) * 100) 
      : 100;

    res.json({
      status: 'success',
      data: {
        weeklyData: weekData,
        weeklyAverage,
        totalTaken,
        totalMissed
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weekly analytics'
    });
  }
};

// Get adherence history
const getAdherenceHistory = (req, res) => {
  try {
    const { days = 30 } = req.query;
    const reminders = db.getAllReminders();
    const history = [];
    const today = new Date();

    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayReminders = reminders.filter(r => {
        const reminderDate = new Date(r.scheduledTime).toISOString().split('T')[0];
        return reminderDate === dateString;
      });

      const taken = dayReminders.filter(r => r.status === 'taken').length;
      const missed = dayReminders.filter(r => r.status === 'missed').length;

      history.push({
        date: dateString,
        adherence: (taken + missed) > 0 ? Math.round((taken / (taken + missed)) * 100) : null
      });
    }

    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching adherence history'
    });
  }
};

// Log a dose
const logDose = (req, res) => {
  try {
    const { reminderId, status, timestamp } = req.body;

    const log = {
      reminderId,
      status,
      timestamp: timestamp || new Date().toISOString()
    };

    db.addDailyLog(log);

    res.status(201).json({
      status: 'success',
      message: 'Dose logged successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error logging dose'
    });
  }
};

// Get medication history
const getMedicationHistory = (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const reminders = db.getAllReminders();

    const history = reminders
      .filter(r => r.status !== 'pending')
      .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime))
      .slice(0, parseInt(limit))
      .map(r => ({
        id: r.id,
        medicineName: r.medicineName,
        dosage: r.dosage,
        scheduledTime: r.scheduledTime,
        status: r.status,
        actualTime: r.takenAt || r.missedAt || null
      }));

    res.json({
      status: 'success',
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching medication history'
    });
  }
};

module.exports = {
  getOverallAnalytics,
  getDailyAnalytics,
  getWeeklyAnalytics,
  getAdherenceHistory,
  logDose,
  getMedicationHistory
};