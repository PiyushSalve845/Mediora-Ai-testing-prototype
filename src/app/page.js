'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { getReminders } from '@/lib/storage';

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const stats = {
    total: reminders.length,
    taken: reminders.filter(r => r.status === 'taken').length,
    missed: reminders.filter(r => r.status === 'missed').length,
    pending: reminders.filter(r => r.status === 'pending').length,
  };

  const adherence = stats.total > 0 
    ? Math.round((stats.taken / (stats.taken + stats.missed || 1)) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">Mediora AI</span>
        </h1>
        <p className="text-gray-500 mt-1">Your personal medication assistant</p>
      </div>

      {/* Search */}
      <Card>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your medicine..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <Link href={`/medicines${searchQuery ? `?q=${searchQuery}` : ''}`}>
            <Button>Search</Button>
          </Link>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">⏰</div>
            <div>
              <p className="text-sm text-gray-500">Next Dose</p>
              <p className="text-lg font-bold text-gray-800">
                {stats.pending > 0 ? 'Pending' : 'None'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">⚠️</div>
            <div>
              <p className="text-sm text-gray-500">Missed</p>
              <p className="text-lg font-bold text-gray-800">{stats.missed}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">📈</div>
            <div>
              <p className="text-sm text-gray-500">Adherence</p>
              <p className="text-lg font-bold text-gray-800">{adherence}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">👥</div>
            <div>
              <p className="text-sm text-gray-500">Caregiver</p>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/medicines">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition cursor-pointer">
                <span className="text-3xl">💊</span>
                <p className="mt-2 font-medium text-gray-800">Search Medicines</p>
              </div>
            </Link>
            <Link href="/interactions">
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition cursor-pointer">
                <span className="text-3xl">⚠️</span>
                <p className="mt-2 font-medium text-gray-800">Check Interactions</p>
              </div>
            </Link>
            <Link href="/assistant">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition cursor-pointer">
                <span className="text-3xl">🤖</span>
                <p className="mt-2 font-medium text-gray-800">AI Assistant</p>
              </div>
            </Link>
            <Link href="/reminders">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition cursor-pointer">
                <span className="text-3xl">🔔</span>
                <p className="mt-2 font-medium text-gray-800">Add Reminder</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📅 Today's Schedule</CardTitle>
            <Link href="/reminders">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.slice(0, 3).map((rem) => (
                <div key={rem.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💊</span>
                    <div>
                      <p className="font-medium text-gray-800">{rem.medicineName}</p>
                      <p className="text-sm text-gray-500">{rem.dosage}</p>
                    </div>
                  </div>
                  <Badge variant={rem.status === 'taken' ? 'success' : rem.status === 'missed' ? 'danger' : 'info'}>
                    {rem.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reminders yet</p>
              <Link href="/reminders">
                <Button>Add Your First Reminder</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}