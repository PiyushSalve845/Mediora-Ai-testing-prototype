// ============================================
// DATABASE UTILITY FUNCTIONS
// ============================================

const fs = require('fs');
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, '../data');

const DB_PATHS = {
  drugs: path.join(DATA_DIR, 'drugs.json'),
  reminders: path.join(DATA_DIR, 'reminders.json'),
  caregivers: path.join(DATA_DIR, 'caregivers.json'),
  analytics: path.join(DATA_DIR, 'analytics.json'),
  interactions: path.join(DATA_DIR, 'interactions.json')
};

// Read data from JSON file
const readData = (type) => {
  try {
    const filePath = DB_PATHS[type];
    if (!filePath) {
      throw new Error(`Unknown data type: ${type}`);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${type} data:`, error.message);
    return null;
  }
};

// Write data to JSON file
const writeData = (type, data) => {
  try {
    const filePath = DB_PATHS[type];
    if (!filePath) {
      throw new Error(`Unknown data type: ${type}`);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${type} data:`, error.message);
    return false;
  }
};

// Get all drugs
const getAllDrugs = () => {
  const data = readData('drugs');
  return data ? data.drugs : [];
};

// Search drugs by name
const searchDrugs = (query) => {
  const drugs = getAllDrugs();
  const searchTerm = query.toLowerCase().trim();
  
  return drugs.filter(drug => {
    const brandMatch = drug.brandNames.some(name => 
      name.toLowerCase().includes(searchTerm)
    );
    const genericMatch = drug.genericName.toLowerCase().includes(searchTerm);
    return brandMatch || genericMatch;
  });
};

// Get drug by ID
const getDrugById = (id) => {
  const drugs = getAllDrugs();
  return drugs.find(drug => drug.id === id);
};

// Get drug by name (brand or generic)
const getDrugByName = (name) => {
  const drugs = getAllDrugs();
  const searchTerm = name.toLowerCase().trim();
  
  return drugs.find(drug => {
    const brandMatch = drug.brandNames.some(brandName => 
      brandName.toLowerCase() === searchTerm
    );
    const genericMatch = drug.genericName.toLowerCase().includes(searchTerm);
    return brandMatch || genericMatch;
  });
};

// Get all interactions
const getAllInteractions = () => {
  const data = readData('interactions');
  return data ? data.interactions : [];
};

// Check interactions between two drugs
const checkInteraction = (drug1, drug2) => {
  const interactions = getAllInteractions();
  const d1 = drug1.toLowerCase().trim();
  const d2 = drug2.toLowerCase().trim();
  
  return interactions.find(interaction => {
    return (interaction.drug1.toLowerCase() === d1 && interaction.drug2.toLowerCase() === d2) ||
           (interaction.drug1.toLowerCase() === d2 && interaction.drug2.toLowerCase() === d1);
  });
};

// Get all reminders
const getAllReminders = () => {
  const data = readData('reminders');
  return data ? data.reminders : [];
};

// Add a reminder
const addReminder = (reminder) => {
  const data = readData('reminders') || { reminders: [], settings: {} };
  data.reminders.push(reminder);
  return writeData('reminders', data);
};

// Update a reminder
const updateReminder = (id, updates) => {
  const data = readData('reminders');
  if (!data) return false;
  
  const index = data.reminders.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  data.reminders[index] = { ...data.reminders[index], ...updates };
  return writeData('reminders', data);
};

// Delete a reminder
const deleteReminder = (id) => {
  const data = readData('reminders');
  if (!data) return false;
  
  data.reminders = data.reminders.filter(r => r.id !== id);
  return writeData('reminders', data);
};

// Get analytics
const getAnalytics = () => {
  return readData('analytics');
};

// Update analytics
const updateAnalytics = (updates) => {
  const data = readData('analytics') || {};
  const newData = { ...data, ...updates };
  return writeData('analytics', newData);
};

// Add daily log entry
const addDailyLog = (log) => {
  const data = readData('analytics') || { dailyLogs: [] };
  data.dailyLogs.push(log);
  return writeData('analytics', data);
};

// Get caregivers
const getCaregivers = () => {
  const data = readData('caregivers');
  return data ? data.caregivers : [];
};

// Add caregiver
const addCaregiver = (caregiver) => {
  const data = readData('caregivers') || { caregivers: [], patients: [], notifications: [] };
  data.caregivers.push(caregiver);
  return writeData('caregivers', data);
};

module.exports = {
  readData,
  writeData,
  getAllDrugs,
  searchDrugs,
  getDrugById,
  getDrugByName,
  getAllInteractions,
  checkInteraction,
  getAllReminders,
  addReminder,
  updateReminder,
  deleteReminder,
  getAnalytics,
  updateAnalytics,
  addDailyLog,
  getCaregivers,
  addCaregiver
};