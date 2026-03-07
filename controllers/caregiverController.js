// ============================================
// CAREGIVER CONTROLLER
// ============================================

const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');

// Get all caregivers
const getAllCaregivers = (req, res) => {
  try {
    const caregivers = db.getCaregivers();
    res.json({
      status: 'success',
      count: caregivers.length,
      data: caregivers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching caregivers'
    });
  }
};

// Add new caregiver
const addCaregiver = (req, res) => {
  try {
    const { name, email, phone, relationship, patientName } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required'
      });
    }

    const caregiver = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      relationship: relationship || 'Other',
      patientName: patientName || '',
      notificationsEnabled: true,
      createdAt: new Date().toISOString()
    };

    db.addCaregiver(caregiver);

    res.status(201).json({
      status: 'success',
      message: 'Caregiver added successfully',
      data: caregiver
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error adding caregiver'
    });
  }
};

// Update caregiver
const updateCaregiver = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = db.readData('caregivers');
    const index = data.caregivers.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Caregiver not found'
      });
    }

    data.caregivers[index] = { ...data.caregivers[index], ...updates };
    db.writeData('caregivers', data);

    res.json({
      status: 'success',
      message: 'Caregiver updated successfully',
      data: data.caregivers[index]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating caregiver'
    });
  }
};

// Delete caregiver
const deleteCaregiver = (req, res) => {
  try {
    const { id } = req.params;
    
    const data = db.readData('caregivers');
    const initialLength = data.caregivers.length;
    data.caregivers = data.caregivers.filter(c => c.id !== id);
    
    if (data.caregivers.length === initialLength) {
      return res.status(404).json({
        status: 'error',
        message: 'Caregiver not found'
      });
    }

    db.writeData('caregivers', data);

    res.json({
      status: 'success',
      message: 'Caregiver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting caregiver'
    });
  }
};

// Get notifications
const getNotifications = (req, res) => {
  try {
    const data = db.readData('caregivers');
    const notifications = data.notifications || [];
    
    res.json({
      status: 'success',
      count: notifications.length,
      data: notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching notifications'
    });
  }
};

// Send notification
const sendNotification = (req, res) => {
  try {
    const { caregiverId, type, message, patientName, medicineName } = req.body;

    const notification = {
      id: uuidv4(),
      caregiverId,
      type: type || 'alert',
      message,
      patientName: patientName || '',
      medicineName: medicineName || '',
      timestamp: new Date().toISOString(),
      read: false
    };

    const data = db.readData('caregivers');
    if (!data.notifications) data.notifications = [];
    data.notifications.push(notification);
    db.writeData('caregivers', data);

    res.status(201).json({
      status: 'success',
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending notification'
    });
  }
};

// Get patient adherence for caregiver
const getPatientAdherence = (req, res) => {
  try {
    const { patientId } = req.params;
    const analytics = db.getAnalytics();
    
    // Calculate adherence
    const reminders = db.getAllReminders();
    const totalDoses = reminders.length;
    const takenDoses = reminders.filter(r => r.status === 'taken').length;
    const missedDoses = reminders.filter(r => r.status === 'missed').length;
    const adherencePercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

    res.json({
      status: 'success',
      data: {
        patientId,
        totalDoses,
        takenDoses,
        missedDoses,
        adherencePercentage,
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient adherence'
    });
  }
};

module.exports = {
  getAllCaregivers,
  addCaregiver,
  updateCaregiver,
  deleteCaregiver,
  getNotifications,
  sendNotification,
  getPatientAdherence
};