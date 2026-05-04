import { api } from './client'
import type { UserResponseDto, UpdateUserRequestDto } from '../types/api'

// ============================================================================
// User Account API Endpoints
// ============================================================================
// User management and profile operations:
// - list/get/create/update: Admin user CRUD operations
// - linkProfile: User self-service to link doctor/patient profiles
// - changePassword: User self-service password update
// - me: Get current authenticated user

export const usersApi = {
    // ============================================================================
    // User CRUD Operations (Admin only)
    // ============================================================================
    
    /** Get all users - Admin only */
    list: () => api.get<UserResponseDto[]>('/api/users').then(r => r.data),
    
    /** Get user by ID - Admin only */
    get: (id: number) => api.get<UserResponseDto>(`/api/users/${id}`).then(r => r.data),
    
    /** Create new user account - Admin only */
    create: (dto: UpdateUserRequestDto) => api.post<UserResponseDto>('/api/users', dto).then(r => r.data),
    
    /** Update user information - Admin only */
    update: (id: number, dto: UpdateUserRequestDto) => api.put<UserResponseDto>(`/api/users/${id}`, dto).then(r => r.data),
    
    /** Delete user account - Admin only */
    remove: (id: number) => api.delete<void>(`/api/users/${id}`).then(r => r.data),

    // ============================================================================
    // Profile Management (Current user operations)
    // ============================================================================
    
    /**
     * Link doctor and/or patient profiles to user account
     * Allows user to associate themselves with doctor and patient records
     * @param doctorId - Optional doctor profile ID to link
     * @param patientId - Optional patient profile ID to link
     */
    linkProfile: (doctorId?: number | null, patientId?: number | null) =>
        api.patch<UserResponseDto>('/api/users/me/link', { doctorId, patientId }).then(r => r.data),

    /** Change password for current user */
    changePassword: (oldPassword: string, newPassword: string) =>
        api.post<void>('/api/users/me/password', { oldPassword, newPassword }).then(r => r.data),

    /** Get current authenticated user profile */
    me: () => api.get<UserResponseDto>('/api/users/me').then(r => r.data)
}