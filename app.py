"""
============================================
MEDIORA AI - Python AI Engine
Created by Piyush Salve
============================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from mediora_ai import MedioraAI
import os

app = Flask(__name__)
CORS(app)

# Initialize the AI engine
ai = MedioraAI()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'Mediora AI Engine is running',
        'version': '1.0.0'
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', {})
        
        response = ai.get_response(message, context)
        
        return jsonify({
            'status': 'success',
            'data': {
                'query': message,
                'response': response
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/explain', methods=['POST'])
def explain():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        simplified = ai.simplify_text(text)
        
        return jsonify({
            'status': 'success',
            'data': {
                'original': text,
                'simplified': simplified
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/missed-dose', methods=['POST'])
def missed_dose_guidance():
    try:
        data = request.get_json()
        drug_name = data.get('drugName', '')
        
        guidance = ai.get_missed_dose_guidance(drug_name)
        
        return jsonify({
            'status': 'success',
            'data': guidance
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    suggestions = [
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
    ]
    
    return jsonify({
        'status': 'success',
        'data': suggestions
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print('')
    print('╔════════════════════════════════════════════════════════╗')
    print('║                                                        ║')
    print('║     🧠 MEDIORA AI - Python Engine                      ║')
    print('║                                                        ║')
    print(f'║     🚀 Running on: http://localhost:{port}               ║')
    print('║                                                        ║')
    print('║     Created by Piyush Salve                            ║')
    print('║                                                        ║')
    print('╚════════════════════════════════════════════════════════╝')
    print('')
    app.run(host='0.0.0.0', port=port, debug=True)