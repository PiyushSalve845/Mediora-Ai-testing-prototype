// ============================================
// AI ASSISTANT ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Chat with AI assistant
router.post('/chat', aiController.chat);

// Get suggested questions
router.get('/suggestions', aiController.getSuggestedQuestions);

// Get AI explanation for medical text
router.post('/explain', aiController.explainMedicalText);

// Get missed dose guidance
router.post('/missed-dose', aiController.getMissedDoseGuidance);

module.exports = router;