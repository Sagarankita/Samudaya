const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id: string) => apiCall(`/users/${id}`),
  update: (id: string, data: any) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiCall('/events'),
  getById: (id: string) => apiCall(`/events/${id}`),
  create: (data: any) =>
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/events/${id}`, {
      method: 'DELETE',
    }),
  register: (id: string, userId: string) =>
    apiCall(`/events/${id}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => apiCall('/announcements'),
  create: (data: any) =>
    apiCall('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/announcements/${id}`, {
      method: 'DELETE',
    }),
};

// Forum API
export const forumAPI = {
  getThreads: () => apiCall('/forum/threads'),
  createThread: (data: any) =>
    apiCall('/forum/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteThread: (id: string) =>
    apiCall(`/forum/threads/${id}`, {
      method: 'DELETE',
    }),
  pinThread: (id: string) =>
    apiCall(`/forum/threads/${id}/pin`, {
      method: 'PUT',
    }),
};

// Volunteers API
export const volunteersAPI = {
  getAll: () => apiCall('/volunteers'),
  register: (data: any) =>
    apiCall('/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUserHistory: (userId: string) => apiCall(`/volunteers/user/${userId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => apiCall('/admin/stats'),
  getPendingEvents: () => apiCall('/admin/events/pending'),
  approveEvent: (id: string) =>
    apiCall(`/admin/events/${id}/approve`, {
      method: 'PUT',
    }),
  rejectEvent: (id: string) =>
    apiCall(`/admin/events/${id}/reject`, {
      method: 'PUT',
    }),
};