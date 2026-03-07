'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import Input from '@/components/UI/Input';
import Modal from '@/components/UI/Modal';
import { getReminders, addReminder, updateReminder, deleteReminder } from '@/lib/storage';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medicineName: '', dosage: '', time: '08:00', notes: '' });

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReminders = addReminder({
      ...form,
      scheduledTime: new Date().toISOString().split('T')[0] + 'T' + form.time,
    });
    setReminders(newReminders);
    setForm({ medicineName: '', dosage: '', time: '08:00', notes: '' });
    setShowModal(false);
  };

  const handleStatusChange = (id, status) => {
    const updated = updateReminder(id, { status });
    setReminders(updated);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this reminder?')) {
      const updated = deleteReminder(id);
      setReminders(updated);
    }
  };

  const stats = {
    total: reminders.length,
    taken: reminders.filter(r => r.status === 'taken').length,
    missed: reminders.filter(r => r.status === 'missed').length,
    pending: reminders.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Medication <span className="text-indigo-600">Reminders</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your medication schedule</p>
        </div>
        <Button onClick={() => setShowModal(true)}>➕ Add Reminder</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-4" className="bg-blue-50">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card padding="p-4" className="bg-green-50">
          <p className="text-2xl font-bold text-green-600">{stats.taken}</p>
          <p className="text-sm text-gray-500">Taken</p>
        </Card>
        <Card padding="p-4" className="bg-red-50">
          <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
          <p className="text-sm text-gray-500">Missed</p>
        </Card>
        <Card padding="p-4" className="bg-yellow-50">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
      </div>

      <div className="space-y-4">
        {reminders.length > 0 ? (
          reminders.map((rem) => (
            <Card key={rem.id} className={`border-l-4 ${
              rem.status === 'taken' ? 'border-l-green-500 bg-green-50/50' :
              rem.status === 'missed' ? 'border-l-red-500 bg-red-50/50' :
              'border-l-blue-500'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    rem.status === 'taken' ? 'bg-green-100' :
                    rem.status === 'missed' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>💊</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{rem.medicineName}</h3>
                    <p className="text-gray-500">{rem.dosage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">⏰ {rem.time || 'N/A'}</span>
                      <Badge variant={rem.status === 'taken' ? 'success' : rem.status === 'missed' ? 'danger' : 'info'} size="sm">
                        {rem.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rem.status === 'pending' && (
                    <>
                      <Button variant="success" size="sm" onClick={() => handleStatusChange(rem.id, 'taken')}>✓ Taken</Button>
                      <Button variant="danger" size="sm" onClick={() => handleStatusChange(rem.id, 'missed')}>✗ Missed</Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(rem.id)}>🗑️</Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <p className="text-4xl mb-4">🔔</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No reminders yet</h3>
            <p className="text-gray-500 mb-4">Add your first medication reminder</p>
            <Button onClick={() => setShowModal(true)}>Add Reminder</Button>
          </Card>
        )}
      </div>

      {stats.missed > 0 && (
        <Card className="bg-red-50 border-2 border-red-200">
          <div className="flex gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Missed Dose Guidance</h3>
              <ul className="space-y-1 text-red-700 text-sm">
                <li>• Take the missed dose as soon as you remember</li>
                <li>• Skip if it's close to your next scheduled dose</li>
                <li>• <strong>Never take a double dose</strong></li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Reminder">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Medicine Name" placeholder="e.g., Metformin" value={form.medicineName} onChange={(e) => setForm({...form, medicineName: e.target.value})} required />
          <Input label="Dosage" placeholder="e.g., 500mg" value={form.dosage} onChange={(e) => setForm({...form, dosage: e.target.value})} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
            <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <Input label="Notes (Optional)" placeholder="e.g., Take with food" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Reminder</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}