// ============================================
// AI ASSISTANT CONTROLLER
// ============================================

const axios = require('axios');
const db = require('../utils/database');
const config = require('../config/config');

// Knowledge base for AI responses
const knowledgeBase = {
  greetings: [
    "Hello! I'm Mediora AI, your medication assistant. How can I help you today?",
    "Hi there! I'm here to help you with medication-related questions. What would you like to know?",
    "Welcome! I can help you understand your medications, check interactions, and provide guidance. What do you need?"
  ],
  
  generalQuestions: {
    'take with food': "Most medications can be taken with food unless specified otherwise. Taking medicine with food can help reduce stomach upset. However, some medications are better absorbed on an empty stomach. Always check the specific instructions for your medication.",
    'take with water': "It's generally recommended to take medications with a full glass of water (about 8 ounces). This helps the medicine dissolve properly and reach your stomach. Avoid taking medications with alcohol, grapefruit juice, or milk unless approved by your doctor.",
    'store medication': "Most medications should be stored at room temperature (59-77°F or 15-25°C) in a dry place away from direct sunlight. Some medications require refrigeration - check your prescription label. Keep all medications away from children and pets.",
    'expired medicine': "Expired medications may be less effective and potentially harmful. It's best to dispose of expired medications properly. Many pharmacies have drug take-back programs. Never flush medications unless specifically instructed.",
    'generic vs brand': "Generic medications contain the same active ingredients as brand-name drugs and must meet the same FDA standards. They're typically more affordable. The main differences are in inactive ingredients, which rarely cause issues.",
    'side effects': "Side effects vary by medication. Common side effects include nausea, headache, dizziness, and drowsiness. Always read the medication information provided by your pharmacy. Report severe or unusual side effects to your doctor immediately.",
    'interactions': "Drug interactions can occur between medications, or between medications and food, drinks, or supplements. Always inform your doctor and pharmacist about all medications you take. Use the interaction checker in this app for more information.",
    'miss a dose': "If you miss a dose, take it as soon as you remember unless it's close to your next scheduled dose. Never take a double dose to make up for a missed one. For specific guidance, check the medication's instructions or ask your pharmacist."
  },

  medicationGuidance: {
    'morning': "Medications taken in the morning are often those that may cause alertness or need to be taken on an empty stomach. Examples include thyroid medications and certain antibiotics.",
    'evening': "Evening medications often include those that may cause drowsiness or work best during sleep. Some blood pressure and cholesterol medications are more effective when taken at night.",
    'with meals': "Taking medications with meals helps reduce stomach irritation and may improve absorption for some drugs. Common examples include NSAIDs like ibuprofen and the diabetes medication metformin.",
    'empty stomach': "Some medications are absorbed better without food. These are typically taken 1 hour before or 2 hours after meals. Examples include certain antibiotics and thyroid medications."
  },

  safetyResponses: {
    emergency: "If you're experiencing a medical emergency, please call emergency services (911 in the US) immediately. This app is for informational purposes only and cannot provide emergency medical care.",
    overdose: "If you suspect an overdose, call Poison Control (1-800-222-1222 in the US) or emergency services immediately. Do not wait for symptoms to appear.",
    allergicReaction: "Signs of a severe allergic reaction include difficulty breathing, swelling of face/throat, and severe rash. Seek immediate medical attention if you experience these symptoms.",
    disclaimer: "The information provided by Mediora AI is for educational purposes only and should not replace professional medical advice. Always consult your healthcare provider for medical decisions."
  }
};

// Chat with AI assistant
const chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    // Generate response based on message content
    const response = generateResponse(message.toLowerCase(), context);

    res.json({
      status: 'success',
      data: {
        query: message,
        response: response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error processing message'
    });
  }
};

// Generate AI response
const generateResponse = (message, context = {}) => {
  // Check for greetings
  if (message.match(/^(hi|hello|hey|good morning|good evening)/i)) {
    return knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
  }

  // Check for emergency keywords
  if (message.match(/(emergency|overdose|can't breathe|chest pain|severe|dying)/i)) {
    return knowledgeBase.safetyResponses.emergency;
  }

  // Check for overdose
  if (message.match(/(overdose|too much|too many|double dose)/i)) {
    return knowledgeBase.safetyResponses.overdose;
  }

  // Check for allergic reaction
  if (message.match(/(allergic|allergy|swelling|hives|rash|reaction)/i)) {
    return knowledgeBase.safetyResponses.allergicReaction;
  }

  // Check for specific medication questions
  const drugMatch = message.match(/(?:about|taking|take|using)\s+(\w+)/i);
  if (drugMatch) {
    const drugName = drugMatch[1];
    const drug = db.getDrugByName(drugName);
    if (drug) {
      return generateDrugResponse(drug, message);
    }
  }

  // Check for general questions
  for (const [key, response] of Object.entries(knowledgeBase.generalQuestions)) {
    if (message.includes(key)) {
      return response;
    }
  }

  // Check for medication guidance
  for (const [key, response] of Object.entries(knowledgeBase.medicationGuidance)) {
    if (message.includes(key)) {
      return response;
    }
  }

  // Check for missed dose question
  if (message.match(/(miss|missed|forgot|forget)/i) && message.match(/(dose|medication|medicine|pill)/i)) {
    return knowledgeBase.generalQuestions['miss a dose'];
  }

  // Check for interaction questions
  if (message.match(/(interact|interaction|combine|together|mix)/i)) {
    return "To check drug interactions, please use our Drug Interaction Checker. Enter the names of the medications you want to check, and I'll provide detailed information about any potential interactions.";
  }

  // Check for side effect questions
  if (message.match(/(side effect|adverse|reaction)/i)) {
    return knowledgeBase.generalQuestions['side effects'];
  }

  // Default response
  return "I can help you with medication questions including:\n\n• Information about specific medications\n• Drug interactions\n• Dosage guidance\n• Missed dose advice\n• Storage instructions\n• General medication safety\n\nPlease ask a specific question or search for a medication to learn more.";
};

// Generate response for a specific drug
const generateDrugResponse = (drug, message) => {
  if (message.match(/(side effect|adverse)/i)) {
    const effects = drug.sideEffects?.common?.join(', ') || 'No common side effects listed';
    return `Common side effects of ${drug.genericName} include: ${effects}. Contact your doctor if you experience severe or persistent side effects.`;
  }

  if (message.match(/(dose|dosage|how much)/i)) {
    return `Dosage for ${drug.genericName}:\n\nAdults: ${drug.dosage?.adults || 'Consult your doctor'}\n\nAlways follow your prescribed dosage. Do not change your dose without consulting your healthcare provider.`;
  }

  if (message.match(/(use|used for|treat|indication)/i)) {
    const uses = drug.uses?.join('\n• ') || 'No uses listed';
    return `${drug.genericName} is used for:\n• ${uses}`;
  }

  if (message.match(/(warning|caution|careful)/i)) {
    const warnings = drug.warnings?.slice(0, 3).join('\n• ') || 'No specific warnings listed';
    return `Important warnings for ${drug.genericName}:\n• ${warnings}`;
  }

  if (message.match(/(interact|combination)/i)) {
    const interactions = drug.interactions?.slice(0, 3).map(i => `${i.drug}: ${i.description}`).join('\n• ') || 'No common interactions listed';
    return `Known interactions for ${drug.genericName}:\n• ${interactions}\n\nAlways check with your pharmacist or doctor before combining medications.`;
  }

  // General information
  return `${drug.genericName} (${drug.brandNames?.[0] || 'Various brands'})\n\nClass: ${drug.drugClass}\n\n${drug.description || ''}\n\nWould you like to know about the dosage, side effects, or interactions?`;
};

// Get suggested questions
const getSuggestedQuestions = (req, res) => {
  const suggestions = [
    "Can I take this medicine with food?",
    "What are the common side effects?",
    "What should I do if I miss a dose?",
    "How should I store my medications?",
    "Can I take this with my other medications?",
    "What time of day is best to take this?",
    "Are generic medications as effective?",
    "What should I avoid while taking this?",
    "How long until the medication starts working?",
    "What if I experience side effects?"
  ];

  res.json({
    status: 'success',
    data: suggestions
  });
};

// Explain medical text
const explainMedicalText = (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Text is required'
      });
    }

    const simplified = simplifyText(text);

    res.json({
      status: 'success',
      data: {
        original: text,
        simplified: simplified
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error explaining text'
    });
  }
};

// Simplify medical text
const simplifyText = (text) => {
  const replacements = {
    'hypertension': 'high blood pressure',
    'hypotension': 'low blood pressure',
    'tachycardia': 'fast heart rate',
    'bradycardia': 'slow heart rate',
    'dyspnea': 'difficulty breathing',
    'edema': 'swelling',
    'pyrexia': 'fever',
    'nausea': 'feeling sick',
    'emesis': 'vomiting',
    'cephalgia': 'headache',
    'myalgia': 'muscle pain',
    'arthralgia': 'joint pain',
    'pruritus': 'itching',
    'somnolence': 'drowsiness',
    'insomnia': 'difficulty sleeping',
    'anorexia': 'loss of appetite',
    'constipation': 'difficulty passing stool',
    'diarrhea': 'loose or watery stool',
    'hepatic': 'liver',
    'renal': 'kidney',
    'pulmonary': 'lung',
    'cardiac': 'heart',
    'gastric': 'stomach',
    'oral': 'mouth',
    'topical': 'on the skin',
    'parenteral': 'by injection',
    'sublingual': 'under the tongue',
    'indicated for': 'used to treat',
    'contraindicated': 'should not be used',
    'adverse events': 'side effects',
    'concomitant': 'at the same time',
    'prophylaxis': 'prevention',
    'acute': 'sudden and severe',
    'chronic': 'long-lasting',
    'q.d.': 'once daily',
    'b.i.d.': 'twice daily',
    't.i.d.': 'three times daily',
    'q.i.d.': 'four times daily',
    'p.r.n.': 'as needed',
    'h.s.': 'at bedtime',
    'a.c.': 'before meals',
    'p.c.': 'after meals'
  };

  let simplified = text;
  for (const [medical, simple] of Object.entries(replacements)) {
    const regex = new RegExp(medical, 'gi');
    simplified = simplified.replace(regex, simple);
  }

  return simplified;
};

// Get missed dose guidance
const getMissedDoseGuidance = (req, res) => {
  try {
    const { drugName, lastDoseTime, nextDoseTime } = req.body;

    let guidance = {
      action: 'take_now',
      message: '',
      warnings: []
    };

    const drug = db.getDrugByName(drugName);

    if (drug && drug.missedDoseGuidance) {
      guidance.message = drug.missedDoseGuidance.instruction;
      guidance.warnings.push(drug.missedDoseGuidance.warning);
      if (drug.missedDoseGuidance.additionalInfo) {
        guidance.additionalInfo = drug.missedDoseGuidance.additionalInfo;
      }
    } else {
      // Default guidance
      const now = new Date();
      const nextDose = nextDoseTime ? new Date(nextDoseTime) : null;
      
      if (nextDose) {
        const hoursUntilNext = (nextDose - now) / (1000 * 60 * 60);
        
        if (hoursUntilNext < 2) {
          guidance.action = 'skip';
          guidance.message = "Skip the missed dose as your next dose is coming up soon. Take your next dose at the regular time.";
        } else {
          guidance.action = 'take_now';
          guidance.message = "Take the missed dose as soon as you remember.";
        }
      } else {
        guidance.message = "Take the missed dose as soon as you remember. If it's almost time for your next dose, skip the missed dose.";
      }

      guidance.warnings.push("Never take a double dose to make up for a missed one.");
    }

    res.json({
      status: 'success',
      data: guidance
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error getting missed dose guidance'
    });
  }
};

module.exports = {
  chat,
  getSuggestedQuestions,
  explainMedicalText,
  getMissedDoseGuidance
};