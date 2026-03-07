// ============================================
// INTERACTION CONTROLLER
// ============================================

const axios = require('axios');
const db = require('../utils/database');
const config = require('../config/config');

// Check interaction between two drugs
const checkInteraction = async (req, res) => {
  try {
    const { drug1, drug2 } = req.query;

    if (!drug1 || !drug2) {
      return res.status(400).json({
        status: 'error',
        message: 'Both drug1 and drug2 are required'
      });
    }

    // First check local database
    let interaction = db.checkInteraction(drug1, drug2);

    // If not found locally, try RxNav API
    if (!interaction) {
      try {
        const rxnavInteraction = await checkRxNavInteraction(drug1, drug2);
        if (rxnavInteraction) {
          interaction = rxnavInteraction;
        }
      } catch (apiError) {
        console.log('RxNav API error, using local database only');
      }
    }

    if (!interaction) {
      return res.json({
        status: 'success',
        hasInteraction: false,
        message: 'No known interaction found between these medications',
        data: null
      });
    }

    res.json({
      status: 'success',
      hasInteraction: true,
      data: interaction
    });

  } catch (error) {
    console.error('Interaction check error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error checking drug interaction'
    });
  }
};

// Check multiple drug interactions
const checkMultipleInteractions = async (req, res) => {
  try {
    const { drugs } = req.body;

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'At least 2 drugs are required'
      });
    }

    const interactions = [];

    // Check all pairs
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        let interaction = db.checkInteraction(drugs[i], drugs[j]);
        
        if (!interaction) {
          try {
            interaction = await checkRxNavInteraction(drugs[i], drugs[j]);
          } catch (e) {
            // Continue with local database only
          }
        }

        if (interaction) {
          interactions.push({
            drug1: drugs[i],
            drug2: drugs[j],
            ...interaction
          });
        }
      }
    }

    // Sort by severity
    const severityOrder = { high: 0, moderate: 1, low: 2 };
    interactions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    res.json({
      status: 'success',
      totalChecked: (drugs.length * (drugs.length - 1)) / 2,
      interactionsFound: interactions.length,
      data: interactions
    });

  } catch (error) {
    console.error('Multiple interaction check error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error checking drug interactions'
    });
  }
};

// Get RxCUI for a drug name
const getRxCUI = async (req, res) => {
  try {
    const { drugName } = req.params;
    
    const rxcui = await fetchRxCUI(drugName);

    if (!rxcui) {
      return res.status(404).json({
        status: 'error',
        message: 'RxCUI not found for this drug'
      });
    }

    res.json({
      status: 'success',
      data: {
        drugName,
        rxcui
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching RxCUI'
    });
  }
};

// Fetch RxCUI from RxNav API
const fetchRxCUI = async (drugName) => {
  try {
    const url = `${config.apis.rxNav.baseUrl}/rxcui.json?name=${encodeURIComponent(drugName)}`;
    const response = await axios.get(url, { timeout: config.apis.rxNav.timeout });

    if (response.data?.idGroup?.rxnormId?.[0]) {
      return response.data.idGroup.rxnormId[0];
    }
    return null;
  } catch (error) {
    console.error('RxCUI fetch error:', error.message);
    return null;
  }
};

// Check interaction using RxNav API
const checkRxNavInteraction = async (drug1, drug2) => {
  try {
    const rxcui1 = await fetchRxCUI(drug1);
    const rxcui2 = await fetchRxCUI(drug2);

    if (!rxcui1 || !rxcui2) {
      return null;
    }

    const url = `${config.apis.rxNav.baseUrl}/interaction/list.json?rxcuis=${rxcui1}+${rxcui2}`;
    const response = await axios.get(url, { timeout: config.apis.rxNav.timeout });

    if (response.data?.fullInteractionTypeGroup?.[0]?.fullInteractionType) {
      const interactionData = response.data.fullInteractionTypeGroup[0].fullInteractionType[0];
      const interactionPair = interactionData?.interactionPair?.[0];

      if (interactionPair) {
        return {
          drug1,
          drug2,
          severity: mapRxNavSeverity(interactionPair.severity),
          description: interactionPair.description,
          recommendation: 'Consult your healthcare provider before taking these medications together.',
          source: 'rxnav'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('RxNav interaction check error:', error.message);
    return null;
  }
};

// Map RxNav severity to our severity levels
const mapRxNavSeverity = (rxnavSeverity) => {
  const severityMap = {
    'high': 'high',
    'severe': 'high',
    'moderate': 'moderate',
    'low': 'low',
    'minor': 'low'
  };
  return severityMap[rxnavSeverity?.toLowerCase()] || 'moderate';
};

// Get all known interactions
const getAllInteractions = (req, res) => {
  try {
    const interactions = db.getAllInteractions();
    res.json({
      status: 'success',
      count: interactions.length,
      data: interactions
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching interactions'
    });
  }
};

module.exports = {
  checkInteraction,
  checkMultipleInteractions,
  getRxCUI,
  getAllInteractions
};