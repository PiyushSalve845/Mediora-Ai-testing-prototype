// ============================================
// APPLICATION CONFIGURATION
// ============================================

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // External API Endpoints
  apis: {
    openFDA: {
      baseUrl: 'https://api.fda.gov/drug',
      labelEndpoint: '/label.json',
      timeout: 10000
    },
    rxNav: {
      baseUrl: 'https://rxnav.nlm.nih.gov/REST',
      rxcuiEndpoint: '/rxcui.json',
      interactionEndpoint: '/interaction/list.json',
      timeout: 10000
    },
    aiEngine: {
      baseUrl: process.env.AI_ENGINE_URL || 'http://localhost:5001',
      timeout: 15000
    }
  },

  // Database paths
  database: {
    drugs: './data/drugs.json',
    reminders: './data/reminders.json',
    caregivers: './data/caregivers.json',
    analytics: './data/analytics.json',
    interactions: './data/interactions.json'
  },

  // App info
  app: {
    name: 'Mediora AI',
    version: '1.0.0',
    author: 'Piyush Salve',
    description: 'AI-assisted medication safety platform'
  }
};

module.exports = config;