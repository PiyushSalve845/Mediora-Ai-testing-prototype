'use client';

import { useParams, useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { getDrugById } from '@/lib/drugs';

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const drug = getDrugById(params.id);

  if (!drug) {
    return (
      <div className="text-center py-12">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Drug Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
        ← Back to Medicines
      </button>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-4xl">💊</div>
          <div>
            <Badge variant="primary" className="mb-2">{drug.drugClass}</Badge>
            <h1 className="text-2xl font-bold text-gray-800">{drug.genericName}</h1>
            <p className="text-gray-500 mt-1">Brand names: {drug.brandNames.join(', ')}</p>
            <p className="text-gray-600 mt-3">{drug.description}</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>📋 Uses</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {drug.uses.map((use, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <span className="text-gray-600">{use}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>⏰ Dosage</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50">
                <p className="font-medium text-blue-800">Adults</p>
                <p className="text-blue-700 text-sm">{drug.dosage.adults}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <p className="font-medium text-green-800">Children</p>
                <p className="text-green-700 text-sm">{drug.dosage.children}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>⚠️ Side Effects</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Badge variant="warning" size="sm" className="mb-2">Common</Badge>
                <p className="text-gray-600 text-sm">{drug.sideEffects.common.join(', ')}</p>
              </div>
              <div>
                <Badge variant="danger" size="sm" className="mb-2">Rare</Badge>
                <p className="text-gray-600 text-sm">{drug.sideEffects.rare.join(', ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>🛡️ Warnings</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {drug.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50">
                  <span>⚠️</span>
                  <span className="text-yellow-800 text-sm">{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-2 border-blue-100">
        <CardHeader><CardTitle>⏰ Missed Dose Guidance</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-700">{drug.missedDose}</p>
          <div className="mt-3 p-3 rounded-lg bg-yellow-100 border border-yellow-200">
            <p className="text-yellow-800 font-medium">⚠️ Never take a double dose to make up for a missed one.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}