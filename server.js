// ============================================
// MEDIORA AI - MAIN SERVER FILE
// Created by Piyush Salve
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const drugRoutes = require('./routes/drugs');
const reminderRoutes = require('./routes/reminders');
const interactionRoutes = require('./routes/interactions');
const caregiverRoutes = require('./routes/caregivers');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Request logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Mediora AI Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main API routes
app.use('/api/drugs', drugRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║     🏥 MEDIORA AI - Backend Server                     ║');
  console.log('║                                                        ║');
  console.log(`║     🚀 Server running on: http://localhost:${PORT}        ║`);
  console.log('║     📊 API Endpoint: http://localhost:' + PORT + '/api       ║');
  console.log('║                                                        ║');
  console.log('║     Created by Piyush Salve                            ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;