// ============================================================================
// Admin API Endpoints
// ============================================================================
// Admin-specific operations and system statistics

import { api } from './client'

/**
 * System statistics - counts of users, doctors, and patients
 * Used for admin dashboard overview
 */
export type AdminStats = {
    users: number      // Total user accounts
    doctors: number    // Total doctor profiles
    patients: number   // Total patient profiles
}

export const adminApi = {
    // ============================================================================
    // System Statistics
    // ============================================================================
    
    /** Get system-wide statistics (user counts) - Admin only */
    stats: () => api.get<AdminStats>('/api/admin/stats').then(r => r.data)
}