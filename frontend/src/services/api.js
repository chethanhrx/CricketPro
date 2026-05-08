import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Tournaments
export const tournamentAPI = {
  create: (data) => api.post('/tournaments/create', data),
  getPublic: (id) => api.get(`/tournaments/${id}/public`),
  listPublic: () => api.get('/tournaments/public'),
  getBySlug: (slug) => api.get(`/tournaments/slug/${slug}`),
  myTournaments: () => api.get('/tournaments/my'),
};

// Auction
export const auctionAPI = {
  getWarRoom: (tournamentId) => api.get(`/auction/${tournamentId}/warroom`),
  createSession: (tournamentId) => api.post(`/auction/${tournamentId}/create`),
  addPlayer: (tournamentId, data) => api.post(`/auction/${tournamentId}/add-player`, data),
  startAuction: (tournamentId) => api.post(`/auction/${tournamentId}/start`),
  placeBid: (tournamentId, data) => api.post(`/auction/${tournamentId}/bid`, data),
};

export default api;
