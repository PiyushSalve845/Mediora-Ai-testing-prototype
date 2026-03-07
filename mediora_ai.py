"""
============================================
MEDIORA AI - Core AI Logic
Rule-based AI for medication assistance
============================================
"""

import re
import json
from pathlib import Path

class MedioraAI:
    def __init__(self):
        self.load_knowledge_base()
        
    def load_knowledge_base(self):
        """Load knowledge base from JSON files"""
        self.knowledge_base = {
            'greetings': [
                "Hello! I'm Mediora AI, your personal medication assistant. How can I help you today?",
                "Hi there! I'm here to help you with medication-related questions. What would you like to know?",
                "Welcome! I can help you understand your medications, check interactions, and provide guidance."
            ],
            
            'general_qa': {
                'food': {
                    'keywords': ['food', 'eat', 'meal', 'empty stomach', 'full stomach'],
                    'response': "Most medications can be taken with food unless specified otherwise. Taking medicine with food can help reduce stomach upset. However, some medications are better absorbed on an empty stomach. Always check the specific instructions for your medication or ask your pharmacist."
                },
                'water': {
                    'keywords': ['water', 'drink', 'liquid', 'swallow'],
                    'response': "It's generally recommended to take medications with a full glass of water (about 8 ounces). This helps the medicine dissolve properly and reach your stomach. Avoid taking medications with alcohol, grapefruit juice, or milk unless approved by your doctor."
                },
                'storage': {
                    'keywords': ['store', 'storage', 'keep', 'refrigerat', 'temperature'],
                    'response': "Most medications should be stored at room temperature (59-77°F or 15-25°C) in a dry place away from direct sunlight. Some medications require refrigeration - check your prescription label. Keep all medications away from children and pets."
                },
                'expired': {
                    'keywords': ['expire', 'expiry', 'old', 'outdated'],
                    'response': "Expired medications may be less effective and potentially harmful. It's best to dispose of expired medications properly. Many pharmacies have drug take-back programs. Never flush medications unless specifically instructed."
                },
                'generic': {
                    'keywords': ['generic', 'brand', 'difference', 'same'],
                    'response': "Generic medications contain the same active ingredients as brand-name drugs and must meet the same FDA standards. They're typically more affordable. The main differences are in inactive ingredients, which rarely cause issues."
                },
                'side_effects': {
                    'keywords': ['side effect', 'adverse', 'reaction', 'problem'],
                    'response': "Side effects vary by medication. Common side effects include nausea, headache, dizziness, and drowsiness. Always read the medication information provided by your pharmacy. Report severe or unusual side effects to your doctor immediately."
                },
                'interactions': {
                    'keywords': ['interact', 'combination', 'together', 'mix'],
                    'response': "Drug interactions can occur between medications, or between medications and food, drinks, or supplements. Always inform your doctor and pharmacist about all medications you take. Use the interaction checker in this app for more information."
                },
                'missed_dose': {
                    'keywords': ['miss', 'forgot', 'skip', 'late'],
                    'response': "If you miss a dose, take it as soon as you remember unless it's close to your next scheduled dose. Never take a double dose to make up for a missed one. For specific guidance, check the medication's instructions or ask your pharmacist."
                },
                'pregnancy': {
                    'keywords': ['pregnan', 'baby', 'breastfeed', 'nursing'],
                    'response': "Many medications can affect pregnancy and breastfeeding. Always consult your healthcare provider before taking any medication if you are pregnant, planning to become pregnant, or breastfeeding."
                },
                'alcohol': {
                    'keywords': ['alcohol', 'drink', 'beer', 'wine'],
                    'response': "Many medications can interact with alcohol, causing increased side effects or reduced effectiveness. It's generally safest to avoid alcohol while taking medications. Check with your pharmacist or doctor about specific interactions."
                }
            },
            
            'drug_specific': {
                'metformin': {
                    'food': "Metformin should be taken with meals to reduce stomach upset. Taking it with food also helps your body absorb it better.",
                    'side_effects': "Common side effects include nausea, diarrhea, and stomach upset. These usually improve after a few weeks. Rare but serious: lactic acidosis.",
                    'missed_dose': "Take the missed dose with your next meal. If close to your next dose, skip it. Never double the dose."
                },
                'aspirin': {
                    'food': "Aspirin should be taken with food or milk to reduce stomach irritation.",
                    'side_effects': "May cause stomach upset, heartburn, or easy bruising. Contact doctor if you notice black stools or vomit that looks like coffee grounds.",
                    'missed_dose': "For daily heart protection doses, take as soon as remembered. Don't double up."
                },
                'ibuprofen': {
                    'food': "Take ibuprofen with food or milk to prevent stomach upset.",
                    'side_effects': "Can cause stomach pain, nausea, and increased blood pressure. Long-term use may affect kidneys.",
                    'missed_dose': "Take when you remember if you need pain relief. Don't exceed daily maximum dose."
                },
                'omeprazole': {
                    'food': "Take omeprazole 30-60 minutes before a meal, preferably breakfast, for best effect.",
                    'side_effects': "May cause headache, nausea, or diarrhea. Long-term use may affect vitamin B12 and magnesium levels.",
                    'missed_dose': "Take as soon as you remember. If almost time for next dose, skip the missed dose."
                },
                'atorvastatin': {
                    'food': "Can be taken with or without food. Avoid grapefruit juice as it increases drug levels.",
                    'side_effects': "May cause muscle pain or weakness. Report unexplained muscle pain to your doctor immediately.",
                    'missed_dose': "Take as soon as you remember, unless it's almost time for your next dose."
                },
                'amlodipine': {
                    'food': "Can be taken with or without food.",
                    'side_effects': "May cause ankle swelling, dizziness, and flushing. These often improve with continued use.",
                    'missed_dose': "Take as soon as you remember. If close to next dose, skip the missed one."
                },
                'losartan': {
                    'food': "Can be taken with or without food.",
                    'side_effects': "May cause dizziness, especially when starting. Rise slowly from sitting or lying down.",
                    'missed_dose': "Take when remembered unless close to next dose. Don't double up."
                },
                'levothyroxine': {
                    'food': "Take on an empty stomach, 30-60 minutes before breakfast. Don't take with calcium or iron supplements.",
                    'side_effects': "Side effects usually mean the dose needs adjusting. Watch for rapid heartbeat, weight changes, or anxiety.",
                    'missed_dose': "Take as soon as you remember. Can take at bedtime if you miss morning dose."
                }
            },
            
            'safety_responses': {
                'emergency': "If you're experiencing a medical emergency, please call emergency services (911 in the US) immediately. This app is for informational purposes only and cannot provide emergency medical care.",
                'overdose': "If you suspect an overdose, call Poison Control (1-800-222-1222 in the US) or emergency services immediately. Do not wait for symptoms to appear.",
                'allergic': "Signs of a severe allergic reaction include difficulty breathing, swelling of face/throat, and severe rash. Seek immediate medical attention if you experience these symptoms."
            }
        }
    
    def get_response(self, message, context=None):
        """Generate response based on user message"""
        message_lower = message.lower().strip()
        
        # Check for emergency keywords first
        if self._is_emergency(message_lower):
            return self.knowledge_base['safety_responses']['emergency']
        
        if self._is_overdose(message_lower):
            return self.knowledge_base['safety_responses']['overdose']
        
        if self._is_allergic_reaction(message_lower):
            return self.knowledge_base['safety_responses']['allergic']
        
        # Check for greetings
        if self._is_greeting(message_lower):
            return self.knowledge_base['greetings'][0]
        
        # Check for drug-specific questions
        drug_response = self._check_drug_specific(message_lower)
        if drug_response:
            return drug_response
        
        # Check general QA
        general_response = self._check_general_qa(message_lower)
        if general_response:
            return general_response
        
        # Default response
        return self._get_default_response()
    
    def _is_greeting(self, message):
        greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon']
        return any(message.startswith(g) for g in greetings)
    
    def _is_emergency(self, message):
        emergency_words = ['emergency', 'dying', 'cant breathe', "can't breathe", 'chest pain', 'heart attack', 'stroke']
        return any(word in message for word in emergency_words)
    
    def _is_overdose(self, message):
        overdose_words = ['overdose', 'too much', 'too many pills', 'double dose', 'took extra']
        return any(word in message for word in overdose_words)
    
    def _is_allergic_reaction(self, message):
        allergy_words = ['allergic reaction', 'swelling face', 'cant breathe', 'hives', 'anaphylaxis']
        return any(word in message for word in allergy_words)
    
    def _check_drug_specific(self, message):
        """Check for drug-specific questions"""
        for drug_name, info in self.knowledge_base['drug_specific'].items():
            if drug_name in message:
                # Determine what type of question
                if any(word in message for word in ['food', 'eat', 'meal']):
                    return info.get('food', '')
                elif any(word in message for word in ['side effect', 'effect', 'reaction']):
                    return info.get('side_effects', '')
                elif any(word in message for word in ['miss', 'forgot', 'skip']):
                    return info.get('missed_dose', '')
                else:
                    # Return general info about the drug
                    return f"I can help you with {drug_name}. Would you like to know about:\n• Taking it with food\n• Side effects\n• What to do if you miss a dose"
        return None
    
    def _check_general_qa(self, message):
        """Check general Q&A knowledge base"""
        for topic, data in self.knowledge_base['general_qa'].items():
            if any(keyword in message for keyword in data['keywords']):
                return data['response']
        return None
    
    def _get_default_response(self):
        return """I can help you with medication-related questions including:

• Information about specific medications
• Drug interactions and safety
• Dosage guidance and administration
• Missed dose advice
• Storage instructions
• General medication safety

Please ask a specific question about your medication, or search for a drug by name to learn more. For example, you can ask "Can I take metformin with food?" or "What are the side effects of aspirin?" """
    
    def simplify_text(self, text):
        """Convert medical jargon to simple language"""
        replacements = {
            'hypertension': 'high blood pressure',
            'hypotension': 'low blood pressure',
            'tachycardia': 'fast heart rate',
            'bradycardia': 'slow heart rate',
            'dyspnea': 'difficulty breathing',
            'edema': 'swelling',
            'pyrexia': 'fever',
            'nausea': 'feeling sick to your stomach',
            'emesis': 'vomiting',
            'cephalgia': 'headache',
            'myalgia': 'muscle pain',
            'arthralgia': 'joint pain',
            'pruritus': 'itching',
            'somnolence': 'drowsiness',
            'insomnia': 'difficulty sleeping',
            'anorexia': 'loss of appetite',
            'hepatic': 'liver-related',
            'renal': 'kidney-related',
            'cardiac': 'heart-related',
            'pulmonary': 'lung-related',
            'gastric': 'stomach-related',
            'oral': 'by mouth',
            'topical': 'applied on skin',
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
            'p.c.': 'after meals',
            'stat': 'immediately'
        }
        
        result = text.lower()
        for medical, simple in replacements.items():
            result = re.sub(r'\b' + medical + r'\b', simple, result, flags=re.IGNORECASE)
        
        # Capitalize first letter
        if result:
            result = result[0].upper() + result[1:]
        
        return result
    
    def get_missed_dose_guidance(self, drug_name):
        """Get missed dose guidance for a specific drug"""
        drug_lower = drug_name.lower()
        
        # Check drug-specific guidance
        if drug_lower in self.knowledge_base['drug_specific']:
            specific_guidance = self.knowledge_base['drug_specific'][drug_lower].get('missed_dose', '')
            if specific_guidance:
                return {
                    'action': 'take_now',
                    'message': specific_guidance,
                    'warnings': ['Never take a double dose to make up for a missed one.'],
                    'drug_specific': True
                }
        
        # Default guidance
        return {
            'action': 'take_now',
            'message': 'If you miss a dose, take it as soon as you remember. If it\'s almost time for your next dose, skip the missed dose and continue with your regular schedule.',
            'warnings': [
                'Never take a double dose to make up for a missed one.',
                'If you frequently miss doses, consider setting daily reminders.'
            ],
            'drug_specific': False
        }


if __name__ == '__main__':
    # Test the AI
    ai = MedioraAI()
    
    test_messages = [
        "Hello",
        "Can I take metformin with food?",
        "What are the side effects of aspirin?",
        "I forgot to take my medication",
        "How should I store my medicines?",
        "What is hypertension?"
    ]
    
    print("Testing Mediora AI...\n")
    for msg in test_messages:
        print(f"User: {msg}")
        print(f"AI: {ai.get_response(msg)}\n")
        print("-" * 50 + "\n")