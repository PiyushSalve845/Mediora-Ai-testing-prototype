const isClient = typeof window !== 'undefined';

function getLocalData(key) {
  if (!isClient) return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

function setLocalData(key, data) {
  if (!isClient) return false;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

// Reminders
export function getReminders() {
  return getLocalData('mediora_reminders') || [];
}

export function saveReminders(reminders) {
  return setLocalData('mediora_reminders', reminders);
}

export function addReminder(reminder) {
  const reminders = getReminders();
  reminders.push({
    ...reminder,
    id: `reminder_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  return saveReminders(reminders);
}

export function deleteReminder(id) {
  const reminders = getReminders().filter(r => r.id !== id);
  return saveReminders(reminders);
}

export function updateReminder(id, updates) {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    return saveReminders(reminders);
  }
  return false;
}

export function markReminderAsTaken(id) {
  return updateReminder(id, { status: 'taken', takenAt: new Date().toISOString() });
}

export function markReminderAsMissed(id) {
  return updateReminder(id, { status: 'missed', missedAt: new Date().toISOString() });
}

// Caregivers
export function getCaregivers() {
  return getLocalData('mediora_caregivers') || [];
}

export function addCaregiver(caregiver) {
  const caregivers = getCaregivers();
  caregivers.push({
    ...caregiver,
    id: `caregiver_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  return setLocalData('mediora_caregivers', caregivers);
}

// Chat
export function getChatHistory() {
  return getLocalData('mediora_chat') || [];
}

export function addChatMessage(message) {
  const history = getChatHistory();
  history.push({ ...message, timestamp: new Date().toISOString() });
  if (history.length > 100) history.splice(0, history.length - 100);
  return setLocalData('mediora_chat', history);
}

export function clearChatHistory() {
  return setLocalData('mediora_chat', []);
}