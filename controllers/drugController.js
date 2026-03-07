// ============================================
// DRUG CONTROLLER
// ============================================

const axios = require('axios');
const db = require('../utils/database');
const config = require('../config/config');

// Search drugs from API and fallback
const searchDrugs = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters'
      });
    }

    // First, try to get from local database
    let results = db.searchDrugs(query);

    // If no local results, try OpenFDA API
    if (results.length === 0) {
      try {
        const fdaResponse = await searchOpenFDA(query);
        if (fdaResponse && fdaResponse.length > 0) {
          results = fdaResponse;
        }
      } catch (apiError) {
        console.log('OpenFDA API error, using local database only');
      }
    }

    res.json({
      status: 'success',
      count: results.length,
      data: results,
      source: results.length > 0 ? 'database' : 'none'
    });

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error searching drugs'
    });
  }
};

// Search OpenFDA API
const searchOpenFDA = async (query) => {
  try {
    const brandUrl = `${config.apis.openFDA.baseUrl}${config.apis.openFDA.labelEndpoint}?search=openfda.brand_name:"${query}"&limit=5`;
    
    const response = await axios.get(brandUrl, {
      timeout: config.apis.openFDA.timeout
    });

    if (response.data && response.data.results) {
      return response.data.results.map(result => ({
        id: result.id || `fda_${Date.now()}`,
        brandNames: result.openfda?.brand_name || [],
        genericName: result.openfda?.generic_name?.[0] || 'Unknown',
        drugClass: result.openfda?.pharm_class_epc?.[0] || 'Unknown',
        description: result.description?.[0] || result.purpose?.[0] || '',
        uses: result.indications_and_usage || [],
        dosage: {
          adults: result.dosage_and_administration?.[0] || 'Consult healthcare provider'
        },
        warnings: result.warnings || [],
        sideEffects: {
          common: result.adverse_reactions ? [result.adverse_reactions[0].substring(0, 200)] : []
        },
        contraindications: result.contraindications || [],
        source: 'openfda'
      }));
    }
    return [];
  } catch (error) {
    console.error('OpenFDA API error:', error.message);
    return [];
  }
};

// Get all drugs
const getAllDrugs = (req, res) => {
  try {
    const drugs = db.getAllDrugs();
    res.json({
      status: 'success',
      count: drugs.length,
      data: drugs
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching drugs'
    });
  }
};

// Get drug by ID
const getDrugById = (req, res) => {
  try {
    const { id } = req.params;
    const drug = db.getDrugById(id);

    if (!drug) {
      return res.status(404).json({
        status: 'error',
        message: 'Drug not found'
      });
    }

    res.json({
      status: 'success',
      data: drug
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching drug'
    });
  }
};

// Get drug by name
const getDrugByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    // First check local database
    let drug = db.getDrugByName(name);

    // If not found locally, try OpenFDA
    if (!drug) {
      try {
        const fdaResults = await searchOpenFDA(name);
        if (fdaResults && fdaResults.length > 0) {
          drug = fdaResults[0];
        }
      } catch (apiError) {
        console.log('OpenFDA lookup failed');
      }
    }

    if (!drug) {
      return res.status(404).json({
        status: 'error',
        message: 'Drug not found'
      });
    }

    res.json({
      status: 'success',
      data: drug
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching drug'
    });
  }
};

// Get AI explanation for drug information
const getAIExplanation = (req, res) => {
  try {
    const { text, drugName } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Text is required for explanation'
      });
    }

    const explanation = simplifyMedicalText(text, drugName);

    res.json({
      status: 'success',
      data: {
        original: text,
        simplified: explanation
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error generating explanation'
    });
  }
};

// Rule-based medical text simplification
const simplifyMedicalText = (text, drugName = '') => {
  const simplifications = {
    'hypertension': 'high blood pressure',
    'hypotension': 'low blood pressure',
    'tachycardia': 'fast heart rate',
    'bradycardia': 'slow heart rate',
    'dyspnea': 'difficulty breathing',
    'edema': 'swelling caused by fluid retention',
    'nausea': 'feeling sick to your stomach',
    'pyrexia': 'fever',
    'analgesic': 'pain reliever',
    'antipyretic': 'fever reducer',
    'antihypertensive': 'blood pressure lowering',
    'anticoagulant': 'blood thinner',
    'antiplatelet': 'medication that prevents blood clots',
    'bronchodilator': 'medication that opens up airways',
    'diuretic': 'water pill that makes you urinate more',
    'indicated for': 'used to treat',
    'contraindicated': 'should not be used',
    'adverse reactions': 'side effects',
    'concomitant': 'taken at the same time',
    'hepatic': 'liver-related',
    'renal': 'kidney-related',
    'cardiac': 'heart-related',
    'pulmonary': 'lung-related',
    'gastrointestinal': 'stomach and intestine',
    'parenteral': 'given by injection',
    'oral administration': 'taken by mouth',
    'topical': 'applied on skin',
    'prophylaxis': 'prevention',
    'acute': 'sudden and severe',
    'chronic': 'long-lasting',
    'mg': 'milligrams',
    'bid': 'twice daily',
    'tid': 'three times daily',
    'qid': 'four times daily',
    'prn': 'as needed',
    'stat': 'immediately',
    'po': 'by mouth',
    'hs': 'at bedtime'
  };

  let simplified = text.toLowerCase();
  
  // Apply simplifications
  for (const [medical, simple] of Object.entries(simplifications)) {
    const regex = new RegExp(medical, 'gi');
    simplified = simplified.replace(regex, simple);
  }

  // Capitalize first letter
  simplified = simplified.charAt(0).toUpperCase() + simplified.slice(1);

  return simplified;
};

module.exports = {
  searchDrugs,
  getAllDrugs,
  getDrugById,
  getDrugByName,
  getAIExplanation
};