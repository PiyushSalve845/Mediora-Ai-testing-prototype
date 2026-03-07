// ============================================
// DRUG ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drugController');

// Search drugs
router.get('/search', drugController.searchDrugs);

// Get all drugs
router.get('/', drugController.getAllDrugs);

// Get drug by ID
router.get('/:id', drugController.getDrugById);

// Get drug by name
router.get('/name/:name', drugController.getDrugByName);

// Get AI explanation for drug
router.post('/explain', drugController.getAIExplanation);

module.exports = router;