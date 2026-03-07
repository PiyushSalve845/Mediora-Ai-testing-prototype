// ============================================
// INTERACTION ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

// Check interaction between two drugs
router.get('/check', interactionController.checkInteraction);

// Check multiple drug interactions
router.post('/check-multiple', interactionController.checkMultipleInteractions);

// Get all known interactions
router.get('/', interactionController.getAllInteractions);

// Get RxCUI for a drug name
router.get('/rxcui/:drugName', interactionController.getRxCUI);

module.exports = router;