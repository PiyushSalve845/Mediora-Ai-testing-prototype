// ============================================
// ANALYTICS ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get overall analytics
router.get('/', analyticsController.getOverallAnalytics);

// Get daily analytics
router.get('/daily', analyticsController.getDailyAnalytics);

// Get weekly analytics
router.get('/weekly', analyticsController.getWeeklyAnalytics);

// Get adherence history
router.get('/adherence', analyticsController.getAdherenceHistory);

// Log dose taken
router.post('/log-dose', analyticsController.logDose);

// Get medication history
router.get('/history', analyticsController.getMedicationHistory);

module.exports = router;