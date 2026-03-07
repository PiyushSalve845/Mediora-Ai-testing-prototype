// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Get data from localStorage
function getData(key) {
  if (!isBrowser) return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Save data to localStorage
function saveData(key, data) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error('Failed to save data');
  }
}

// REMINDERS
export function getReminders() {
  return getData('mediora_reminders') || [];
}

export function addReminder(reminder) {
  const reminders = getReminders();
  reminders.push({
    ...reminder,
    id: 'rem_' + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  saveData('mediora_reminders', reminders);
  return reminders;
}

export function updateReminder(id, updates) {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    saveData('mediora_reminders', reminders);
  }
  return reminders;
}

export function deleteReminder(id) {
  const reminders = getReminders().filter(r => r.id !== id);
  saveData('mediora_reminders', reminders);
  return reminders;
}

// CAREGIVERS
export function getCaregivers() {
  return getData('mediora_caregivers') || [];
}

export function addCaregiver(caregiver) {
  const caregivers = getCaregivers();
  caregivers.push({
    ...caregiver,
    id: 'cg_' + Date.now(),
    createdAt: new Date().toISOString(),
  });
  saveData('mediora_caregivers', caregivers);
  return caregivers;
}

// CHAT
export function getChatHistory() {
  return getData('mediora_chat') || [];
}

export function addChatMessage(message) {
  const chat = getChatHistory();
  chat.push({ ...message, timestamp: new Date().toISOString() });
  saveData('mediora_chat', chat);
  return chat;
}

export function clearChat() {
  saveData('mediora_chat', []);
}