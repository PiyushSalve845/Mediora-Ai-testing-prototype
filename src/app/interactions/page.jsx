'use client';

import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Badge from '@/components/UI/Badge';
import { checkInteractions } from '@/lib/drugs';

export default function InteractionsPage() {
  const [drugs, setDrugs] = useState(['', '']);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const updateDrug = (index, value) => {
    const newDrugs = [...drugs];
    newDrugs[index] = value;
    setDrugs(newDrugs);
  };

  const addDrug = () => {
    if (drugs.length < 5) setDrugs([...drugs, '']);
  };

  const removeDrug = (index) => {
    if (drugs.length > 2) setDrugs(drugs.filter((_, i) => i !== index));
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const validDrugs = drugs.filter(d => d.trim());
    
    if (validDrugs.length < 2) {
      setError('Enter at least 2 medications');
      return;
    }

    setError('');
    const found = checkInteractions(validDrugs);
    setResults(found);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Drug <span className="text-indigo-600">Interaction Checker</span>
        </h1>
        <p className="text-gray-500 mt-1">Check for potential interactions</p>
      </div>

      <Card className="bg-blue-50 border-2 border-blue-100">
        <div className="flex gap-4">
          <span className="text-3xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">How it works</h3>
            <p className="text-blue-700 text-sm">Enter medications to check for known interactions and safety information.</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Enter Medications</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCheck}>
            <div className="space-y-3">
              {drugs.map((drug, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xl">💊</span>
                  <Input placeholder={`Medication ${index + 1}`} value={drug} onChange={(e) => updateDrug(index, e.target.value)} className="flex-1" />
                  {drugs.length > 2 && (
                    <Button type="button" variant="ghost" onClick={() => removeDrug(index)}>✕</Button>
                  )}
                </div>
              ))}
              
              {drugs.length < 5 && (
                <button type="button" onClick={addDrug} className="text-indigo-600 text-sm font-medium hover:underline">
                  ➕ Add another medication
                </button>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full mt-4" size="lg">🛡️ Check Interactions</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results !== null && (
        <div className="space-y-4">
          <Card className={results.length > 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-green-50 border-2 border-green-200'}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{results.length > 0 ? '⚠️' : '✅'}</span>
              <div>
                <h3 className={`text-xl font-bold ${results.length > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                  {results.length > 0 ? `${results.length} Interaction(s) Found` : 'No Interactions Found'}
                </h3>
                <p className={results.length > 0 ? 'text-yellow-700' : 'text-green-700'}>
                  {results.length > 0 ? 'Review the details below.' : 'No known interactions between these medications.'}
                </p>
              </div>
            </div>
          </Card>

          {results.map((int, index) => (
            <Card key={index} className={`border-2 ${
              int.severity === 'high' ? 'bg-red-50 border-red-200' :
              int.severity === 'moderate' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{int.severity === 'high' ? '🔴' : int.severity === 'moderate' ? '🟡' : '🟢'}</span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{int.drug1} + {int.drug2}</h4>
                    <Badge variant={int.severity === 'high' ? 'danger' : int.severity === 'moderate' ? 'warning' : 'success'}>
                      {int.severity} risk
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{int.description}</p>
                  <div className="p-3 rounded-lg bg-white/60">
                    <p className="text-sm font-medium">💡 {int.recommendation}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This tool is for informational purposes only. Always consult your healthcare provider.
        </p>
      </Card>
    </div>
  );
}