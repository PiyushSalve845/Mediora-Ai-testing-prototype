// ============================================
// CAREGIVER ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const caregiverController = require('../controllers/caregiverController');

// Get all caregivers
router.get('/', caregiverController.getAllCaregivers);

// Add new caregiver
router.post('/', caregiverController.addCaregiver);

// Update caregiver
router.put('/:id', caregiverController.updateCaregiver);

// Delete caregiver
router.delete('/:id', caregiverController.deleteCaregiver);

// Get caregiver notifications
router.get('/notifications', caregiverController.getNotifications);

// Send notification to caregiver
router.post('/notify', caregiverController.sendNotification);

// Get patient adherence for caregiver
router.get('/adherence/:patientId', caregiverController.getPatientAdherence);

module.exports = router;