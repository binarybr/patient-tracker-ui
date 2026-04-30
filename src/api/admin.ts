// src/api/admin.ts
import { api } from './client'

export type AdminStats = {
    users: number
    doctors: number
    patients: number
}

export const adminApi = {
    stats: () => api.get<AdminStats>('/api/admin/stats').then(r => r.data)
}