import { api } from './client'
import type { Doctor, DoctorDto } from '../types/api'

// ============================================================================
// Doctors API Endpoints
// ============================================================================
// Manages doctor profiles with admin controls:
// - CRUD operations for doctor records
// - Approval workflow for new doctors
// - Soft/hard delete with restore capability

export const doctorsApi = {
  // Public CRUD operations
  // Get all doctors or specific doctor
  list: () => api.get<Doctor[]>('/api/doctors').then(r => r.data),
  get: (id: number) => api.get<Doctor>(`/api/doctors/${id}`).then(r => r.data),
  
  // Create new doctor profile
  create: (dto: DoctorDto) => api.post<Doctor>('/api/doctors', dto).then(r => r.data),
  
  // Update doctor profile information
  update: (id: number, dto: DoctorDto) => api.put<Doctor>(`/api/doctors/${id}`, dto).then(r => r.data),

  // Admin approval workflow
  // Approve a doctor application to enable clinic access
  approve: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/approve`).then(r => r.data),

  // Reject a doctor application
  reject: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/reject`).then(r => r.data),

  // Restore previously deleted doctor
  restore: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/restore`).then(r => r.data),

  // Delete doctor (soft delete by default)
  // soft=true: marks as deleted but keeps data
  // soft=false: permanently removes data
  remove: (id: number, soft = true) =>
    api.delete<void>(`/api/admin/doctors/${id}`, { params: { soft } }).then(r => r.data),
}