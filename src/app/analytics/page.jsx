'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import { getReminders } from '@/lib/storage';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, taken: 0, missed: 0, pending: 0, adherence: 100 });
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const reminders = getReminders();
    const taken = reminders.filter(r => r.status === 'taken').length;
    const missed = reminders.filter(r => r.status === 'missed').length;
    const pending = reminders.filter(r => r.status === 'pending').length;
    const total = taken + missed;

    setStats({
      total: reminders.length,
      taken,
      missed,
      pending,
      adherence: total > 0 ? Math.round((taken / total) * 100) : 100
    });

    // Generate demo weekly data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    setWeekly(days.map(day => ({ day, value: Math.floor(Math.random() * 30) + 70 })));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Medication <span className="text-indigo-600">Analytics</span>
        </h1>
        <p className="text-gray-500 mt-1">Track your medication adherence</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-indigo-50 border-2 border-indigo-100 text-center">
          <p className="text-4xl font-bold text-indigo-600">{stats.adherence}%</p>
          <p className="text-sm text-gray-500 mt-1">Adherence Rate</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${stats.adherence}%` }} />
          </div>
        </Card>
        <Card className="bg-green-50 border-2 border-green-100 text-center">
          <p className="text-4xl font-bold text-green-600">{stats.taken}</p>
          <p className="text-sm text-gray-500 mt-1">Doses Taken</p>
        </Card>
        <Card className="bg-red-50 border-2 border-red-100 text-center">
          <p className="text-4xl font-bold text-red-600">{stats.missed}</p>
          <p className="text-sm text-gray-500 mt-1">Doses Missed</p>
        </Card>
        <Card className="bg-yellow-50 border-2 border-yellow-100 text-center">
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>📊 Weekly Adherence</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-48 gap-2">
            {weekly.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                      day.value >= 80 ? 'bg-green-500' : day.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${day.value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
                <span className="text-xs font-medium">{day.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader><CardTitle>💡 Tips to Improve</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white">
              <h4 className="font-semibold text-gray-800 mb-2">⏰ Be Consistent</h4>
              <p className="text-sm text-gray-600">Take medications at the same time daily.</p>
            </div>
            <div className="p-4 rounded-xl bg-white">
              <h4 className="font-semibold text-gray-800 mb-2">🔔 Use Reminders</h4>
              <p className="text-sm text-gray-600">Set up notifications to never miss a dose.</p>
            </div>
            <div className="p-4 rounded-xl bg-white">
              <h4 className="font-semibold text-gray-800 mb-2">📊 Track Progress</h4>
              <p className="text-sm text-gray-600">Regular monitoring keeps you motivated.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}