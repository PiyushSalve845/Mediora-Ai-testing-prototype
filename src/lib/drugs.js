// Fallback drug database
export const drugs = [
  {
    id: 'drug_001',
    genericName: 'Paracetamol (Acetaminophen)',
    brandNames: ['Tylenol', 'Panadol', 'Crocin'],
    drugClass: 'Analgesic / Antipyretic',
    description: 'Common pain reliever and fever reducer.',
    uses: ['Pain relief', 'Fever reduction', 'Headache', 'Cold symptoms'],
    dosage: { adults: '500-1000mg every 4-6 hours. Max 4000mg/day', children: '10-15mg/kg every 4-6 hours' },
    sideEffects: { common: ['Nausea'], rare: ['Liver damage with overdose'] },
    warnings: ['Do not exceed recommended dose', 'Avoid alcohol'],
    missedDose: 'Take as needed for pain. Do not double dose.',
  },
  {
    id: 'drug_002',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Brufen'],
    drugClass: 'NSAID',
    description: 'Anti-inflammatory pain reliever.',
    uses: ['Pain relief', 'Inflammation', 'Fever', 'Arthritis'],
    dosage: { adults: '200-400mg every 4-6 hours. Max 1200mg/day', children: '5-10mg/kg every 6-8 hours' },
    sideEffects: { common: ['Stomach upset', 'Nausea'], rare: ['Stomach bleeding', 'Kidney problems'] },
    warnings: ['Take with food', 'Avoid if you have stomach ulcers'],
    missedDose: 'Take when remembered. Skip if close to next dose.',
  },
  {
    id: 'drug_003',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Moxatag'],
    drugClass: 'Antibiotic',
    description: 'Penicillin antibiotic for bacterial infections.',
    uses: ['Respiratory infections', 'Ear infections', 'Skin infections', 'UTI'],
    dosage: { adults: '250-500mg every 8 hours', children: '25mg/kg/day divided doses' },
    sideEffects: { common: ['Diarrhea', 'Nausea', 'Rash'], rare: ['Allergic reaction'] },
    warnings: ['Complete full course', 'Tell doctor if allergic to penicillin'],
    missedDose: 'Take as soon as remembered. Never double dose.',
  },
  {
    id: 'drug_004',
    genericName: 'Metformin',
    brandNames: ['Glucophage', 'Fortamet'],
    drugClass: 'Antidiabetic',
    description: 'Controls blood sugar in type 2 diabetes.',
    uses: ['Type 2 diabetes', 'Prediabetes', 'PCOS'],
    dosage: { adults: 'Start 500mg twice daily. Max 2550mg/day', children: '500mg twice daily (10+ years)' },
    sideEffects: { common: ['Nausea', 'Diarrhea', 'Stomach upset'], rare: ['Lactic acidosis'] },
    warnings: ['Take with meals', 'Avoid alcohol', 'Monitor kidney function'],
    missedDose: 'Take with next meal. Never double dose.',
  },
  {
    id: 'drug_005',
    genericName: 'Atorvastatin',
    brandNames: ['Lipitor', 'Atorva'],
    drugClass: 'Statin',
    description: 'Lowers cholesterol and prevents heart disease.',
    uses: ['High cholesterol', 'Heart disease prevention', 'Stroke prevention'],
    dosage: { adults: '10-80mg once daily', children: '10-20mg daily (10+ years)' },
    sideEffects: { common: ['Muscle pain', 'Headache'], rare: ['Liver problems', 'Rhabdomyolysis'] },
    warnings: ['Avoid grapefruit juice', 'Report muscle pain immediately'],
    missedDose: 'Take when remembered unless close to next dose.',
  },
  {
    id: 'drug_006',
    genericName: 'Amlodipine',
    brandNames: ['Norvasc', 'Amlopress'],
    drugClass: 'Calcium Channel Blocker',
    description: 'Treats high blood pressure and chest pain.',
    uses: ['High blood pressure', 'Angina', 'Heart disease'],
    dosage: { adults: '5-10mg once daily', children: '2.5-5mg daily' },
    sideEffects: { common: ['Ankle swelling', 'Dizziness', 'Flushing'], rare: ['Irregular heartbeat'] },
    warnings: ['May cause dizziness', 'Do not stop suddenly'],
    missedDose: 'Take when remembered. Skip if close to next dose.',
  },
  {
    id: 'drug_007',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec'],
    drugClass: 'Proton Pump Inhibitor',
    description: 'Reduces stomach acid production.',
    uses: ['Acid reflux', 'Stomach ulcers', 'GERD', 'Heartburn'],
    dosage: { adults: '20-40mg once daily', children: '10-20mg daily' },
    sideEffects: { common: ['Headache', 'Nausea', 'Diarrhea'], rare: ['Vitamin B12 deficiency'] },
    warnings: ['Take before breakfast', 'Long-term use may affect bones'],
    missedDose: 'Take when remembered. Skip if close to next dose.',
  },
  {
    id: 'drug_008',
    genericName: 'Aspirin',
    brandNames: ['Bayer', 'Ecosprin', 'Disprin'],
    drugClass: 'NSAID / Antiplatelet',
    description: 'Pain reliever and blood thinner.',
    uses: ['Pain relief', 'Fever', 'Heart attack prevention', 'Blood clots'],
    dosage: { adults: 'Pain: 325-650mg every 4-6 hours. Heart: 75-100mg daily', children: 'Not recommended under 16' },
    sideEffects: { common: ['Stomach upset', 'Heartburn'], rare: ['Stomach bleeding', 'Allergic reaction'] },
    warnings: ['Take with food', 'Not for children with viral illness', 'Stop before surgery'],
    missedDose: 'For heart protection: take as soon as remembered.',
  },
  {
    id: 'drug_009',
    genericName: 'Cetirizine',
    brandNames: ['Zyrtec', 'Alerid'],
    drugClass: 'Antihistamine',
    description: 'Treats allergies and hives.',
    uses: ['Allergies', 'Hay fever', 'Hives', 'Itching'],
    dosage: { adults: '10mg once daily', children: '5mg daily (2-6 years), 10mg (6+ years)' },
    sideEffects: { common: ['Drowsiness', 'Dry mouth', 'Headache'], rare: ['Rapid heartbeat'] },
    warnings: ['May cause drowsiness', 'Avoid alcohol'],
    missedDose: 'Take when remembered. Skip if close to next dose.',
  },
  {
    id: 'drug_010',
    genericName: 'Losartan',
    brandNames: ['Cozaar', 'Losacar'],
    drugClass: 'ARB',
    description: 'Treats high blood pressure and protects kidneys.',
    uses: ['High blood pressure', 'Diabetic kidney disease', 'Heart failure'],
    dosage: { adults: '50-100mg once daily', children: '0.7mg/kg daily' },
    sideEffects: { common: ['Dizziness', 'Fatigue', 'Stuffy nose'], rare: ['High potassium', 'Kidney problems'] },
    warnings: ['Do not use in pregnancy', 'Monitor potassium levels'],
    missedDose: 'Take when remembered. Skip if close to next dose.',
  },
];

// Drug interactions database
export const interactions = [
  { drug1: 'aspirin', drug2: 'ibuprofen', severity: 'high', description: 'Both are NSAIDs. Increases bleeding risk.', recommendation: 'Avoid using together.' },
  { drug1: 'aspirin', drug2: 'warfarin', severity: 'high', description: 'Significantly increases bleeding risk.', recommendation: 'Use only under doctor supervision.' },
  { drug1: 'metformin', drug2: 'alcohol', severity: 'high', description: 'Increases risk of lactic acidosis.', recommendation: 'Limit alcohol consumption.' },
  { drug1: 'atorvastatin', drug2: 'grapefruit', severity: 'moderate', description: 'Grapefruit increases drug levels.', recommendation: 'Avoid grapefruit juice.' },
  { drug1: 'omeprazole', drug2: 'clopidogrel', severity: 'high', description: 'Reduces effectiveness of clopidogrel.', recommendation: 'Consider alternative PPI.' },
  { drug1: 'amlodipine', drug2: 'simvastatin', severity: 'moderate', description: 'Increases statin side effects.', recommendation: 'Limit simvastatin to 20mg.' },
  { drug1: 'losartan', drug2: 'potassium', severity: 'high', description: 'May cause high potassium levels.', recommendation: 'Avoid potassium supplements.' },
  { drug1: 'cetirizine', drug2: 'alcohol', severity: 'moderate', description: 'Increases drowsiness.', recommendation: 'Avoid alcohol.' },
  { drug1: 'amoxicillin', drug2: 'methotrexate', severity: 'moderate', description: 'May increase methotrexate toxicity.', recommendation: 'Monitor closely.' },
  { drug1: 'ibuprofen', drug2: 'losartan', severity: 'moderate', description: 'NSAIDs reduce blood pressure medication effect.', recommendation: 'Use with caution.' },
];

// Search drugs
export function searchDrugs(query) {
  const q = query.toLowerCase();
  return drugs.filter(drug =>
    drug.genericName.toLowerCase().includes(q) ||
    drug.brandNames.some(b => b.toLowerCase().includes(q)) ||
    drug.drugClass.toLowerCase().includes(q)
  );
}

// Get drug by ID
export function getDrugById(id) {
  return drugs.find(d => d.id === id);
}

// Check interactions
export function checkInteractions(drugList) {
  const results = [];
  const drugNames = drugList.map(d => d.toLowerCase());
  
  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const match = interactions.find(int =>
        (int.drug1 === drugNames[i] && int.drug2 === drugNames[j]) ||
        (int.drug1 === drugNames[j] && int.drug2 === drugNames[i])
      );
      if (match) {
        results.push({ ...match, drug1: drugList[i], drug2: drugList[j] });
      }
    }
  }
  return results;
}