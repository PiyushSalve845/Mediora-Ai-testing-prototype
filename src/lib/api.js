const API_BASE_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', data: null };
  }
}

export const drugAPI = {
  search: (query) => fetchAPI(`/drugs/search?query=${encodeURIComponent(query)}`),
  getAll: () => fetchAPI('/drugs'),
  getById: (id) => fetchAPI(`/drugs/${id}`),
};

export const reminderAPI = {
  getAll: () => fetchAPI('/reminders'),
  getUpcoming: () => fetchAPI('/reminders/upcoming'),
};

export const interactionAPI = {
  checkMultiple: (drugs) => fetchAPI('/interactions/check-multiple', {
    method: 'POST',
    body: JSON.stringify({ drugs }),
  }),
};

export const analyticsAPI = {
  getOverall: () => fetchAPI('/analytics'),
  getWeekly: () => fetchAPI('/analytics/weekly'),
};

export const aiAPI = {
  chat: (message) => fetchAPI('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  getSuggestions: () => fetchAPI('/ai/suggestions'),
};