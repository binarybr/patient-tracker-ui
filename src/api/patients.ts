import { api } from './client'
import type { Patient, PatientDto } from '../types/api'

// ============================================================================
// Patient API Endpoints
// ============================================================================
// Patient management with role-based operations:
// - list/get/create: Admin operations
// - update: Admin updates patient information
// - updateMine: Patient self-service update of own information
// - remove/restore: Admin soft/hard delete operations

export const patientsApi = {
    // ============================================================================
    // Retrieval Operations
    // ============================================================================
    
    /** Get all patients - Admin only */
    list: () => api.get<Patient[]>('/api/patients').then(r => r.data),
    
    /** Get patient by ID - Admin only */
    get: (id: number) => api.get<Patient>(`/api/patients/${id}`).then(r => r.data),

    // ============================================================================
    // Create/Update Operations
    // ============================================================================
    
    /** Create new patient - Admin only */
    create: (dto: PatientDto) => api.post<Patient>('/api/patients', dto).then(r => r.data),
    
    /** Update patient information - Admin only */
    update: (id: number, dto: PatientDto) => api.put<Patient>(`/api/patients/${id}`, dto).then(r => r.data),

    /** Patient self-service update - Patient updates their own information */
    // Allows patients to modify their own profile data without admin intervention
    updateMine: (dto: PatientDto) => api.patch<Patient>('/api/patients/me', dto).then(r => r.data),

    // ============================================================================
    // Delete Operations (Admin only)
    // ============================================================================
    
    /**
     * Remove patient - soft delete by default (sets isDeleted flag)
     * @param soft - true (default): soft delete; false: permanent hard delete
     */
    remove: (id: number, soft = true) =>
        api.delete<void>(`/api/admin/patients/${id}`, { params: { soft } }).then(r => r.data),

    /** Restore soft-deleted patient - reverts isDeleted flag */
    restore: (id: number) =>
        api.patch<Patient>(`/api/admin/patients/${id}/restore`).then(r => r.data),

}
