import api from './api'
import { mockAuthService } from './mockService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const authService = USE_MOCK ? mockAuthService : {
  login: async (credentials) => { const { data } = await api.post('/auth/login', credentials); return data.data },
  register: async (userData) => { const { data } = await api.post('/auth/register', userData); return data.data },
  changePassword: async (passwords) => { const { data } = await api.put('/auth/change-password', passwords); return data.data },
  updateProfile: async (profileData) => { const { data } = await api.put('/auth/profile', profileData); return data.data },
}
