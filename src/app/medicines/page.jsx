'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/UI/Card';
import Badge from '@/components/UI/Badge';
import Input from '@/components/UI/Input';
import { drugs, searchDrugs } from '@/lib/drugs';

export default function MedicinesPage() {
  const [query, setQuery] = useState('');
  const filtered = query ? searchDrugs(query) : drugs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Medicine <span className="text-indigo-600">Information</span>
        </h1>
        <p className="text-gray-500 mt-1">Search and learn about medications</p>
      </div>

      <Card>
        <Input
          placeholder="Search medicines (e.g., Aspirin, Metformin)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((drug) => (
          <Link key={drug.id} href={`/medicines/${drug.id}`}>
            <Card className="h-full hover:shadow-lg transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{drug.genericName}</h3>
                  <p className="text-sm text-gray-500 truncate">{drug.brandNames.join(', ')}</p>
                  <Badge variant="primary" size="sm" className="mt-2">{drug.drugClass}</Badge>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{drug.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No medicines found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </Card>
      )}
    </div>
  );
}