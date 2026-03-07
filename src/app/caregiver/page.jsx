'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import Input from '@/components/UI/Input';
import Modal from '@/components/UI/Modal';
import { getCaregivers, addCaregiver, getReminders } from '@/lib/storage';

export default function CaregiverPage() {
  const [caregivers, setCaregivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({ adherence: 100, taken: 0, missed: 0 });
  const [form, setForm] = useState({ name: '', email: '', phone: '', relationship: 'Family Member' });

  useEffect(() => {
    setCaregivers(getCaregivers());
    const reminders = getReminders();
    const taken = reminders.filter(r => r.status === 'taken').length;
    const missed = reminders.filter(r => r.status === 'missed').length;
    setStats({
      taken, missed,
      adherence: (taken + missed) > 0 ? Math.round((taken / (taken + missed)) * 100) : 100
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaregivers(addCaregiver(form));
    setForm({ name: '', email: '', phone: '', relationship: 'Family Member' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Caregiver <span className="text-indigo-600">Monitoring</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage caregivers and monitor adherence</p>
        </div>
        <Button onClick={() => setShowModal(true)}>👤 Add Caregiver</Button>
      </div>

      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">❤️</div>
            <div>
              <h2 className="text-xl font-bold">Patient Dashboard</h2>
              <p className="text-white/80">Overall medication status</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.adherence}%</p>
              <p className="text-sm text-white/80">Adherence</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.taken}</p>
              <p className="text-sm text-white/80">Taken</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.missed}</p>
              <p className="text-sm text-white/80">Missed</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>👥 Active Caregivers</CardTitle></CardHeader>
        <CardContent>
          {caregivers.length > 0 ? (
            <div className="space-y-4">
              {caregivers.map((cg) => (
                <div key={cg.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {cg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{cg.name}</h4>
                      <p className="text-sm text-gray-500">{cg.relationship}</p>
                      <p className="text-xs text-gray-400">{cg.email}</p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-4">👥</p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No caregivers added</h3>
              <p className="text-gray-500 mb-4">Add a caregiver to enable monitoring</p>
              <Button onClick={() => setShowModal(true)}>Add Caregiver</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🛡️ Features</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50">
              <h4 className="font-semibold text-gray-800 mb-2">🔔 Instant Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when a dose is missed</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Adherence Tracking</h4>
              <p className="text-sm text-gray-600">Monitor medication compliance</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50">
              <h4 className="font-semibold text-gray-800 mb-2">❤️ Peace of Mind</h4>
              <p className="text-sm text-gray-600">Stay connected with loved ones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Caregiver">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <Input label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <Input label="Phone (Optional)" placeholder="+1 234 567 8900" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Relationship</label>
            <select value={form.relationship} onChange={(e) => setForm({...form, relationship: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <option>Family Member</option>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Child</option>
              <option>Healthcare Provider</option>
              <option>Friend</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}