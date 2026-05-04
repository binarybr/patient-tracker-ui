import { api } from './client'
import type { MedicalCase, CaseDto, MedicalCaseVersion } from '../types/api'

// ============================================================================
// Medical Cases API Endpoints
// ============================================================================
// Manages medical cases (patient medical conditions under doctor care):
// - CRUD operations for cases
// - Case status management (OPEN/CLOSED)
// - Version history tracking for audit trail

export const casesApi = {
    // Get all medical cases (admin/doctor view)
    list: () => api.get<MedicalCase[]>('/api/cases').then(r => r.data),
    
    // Get specific medical case by ID with patient and doctor details
    get: (id: number) => api.get<MedicalCase>(`/api/cases/${id}`).then(r => r.data),
    
    // Create new medical case linking a patient, doctor, and medical information
    create: (dto: CaseDto) => api.post<MedicalCase>('/api/cases', dto).then(r => r.data),
    
    // Update medical case information or status
    // Can update: title, diagnosis, symptoms, medicines, or status
    update: (id: number, dto: Partial<CaseDto & { status: string }>) =>
        api.put<MedicalCase>(`/api/cases/${id}`, dto).then(r => r.data),
    
    // Delete medical case (soft or hard delete)
    remove: (id: number) => api.delete<void>(`/api/cases/${id}`).then(r => r.data),

    // Get all historical versions of a medical case
    // Each version represents changes made to the case for audit trail
    versions: (caseId: number) =>
        api.get<MedicalCaseVersion[]>(`/api/cases/${caseId}/versions`).then(r => r.data),

    // Update case status (e.g., from OPEN to CLOSED)
    setStatus: (id: number, status: string) =>
        api.patch<MedicalCase>(`/api/cases/${id}/status`, { status }).then(r => r.data),
}