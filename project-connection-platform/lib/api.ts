/**
 * API utility functions for making requests to the backend
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, name: string) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiCall('/auth/me'),
}

// Projects API calls
export const projectsAPI = {
  getAll: () => apiCall('/projects'),

  getById: (id: string) => apiCall(`/projects/${id}`),

  create: (data: any) =>
    apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/projects/${id}`, {
      method: 'DELETE',
    }),

  join: (id: string) =>
    apiCall(`/projects/${id}/join`, {
      method: 'POST',
    }),
}
