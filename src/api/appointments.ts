import { api } from './client'
import type { Appointment, AppointmentDto } from '../types/api'

// ============================================================================
// Appointments API Endpoints
// ============================================================================
// Manages appointment scheduling and retrieval:
// - CRUD operations for appointments
// - Filtering by doctor, patient, or user role
// - Date range queries for personal appointments

export const appointmentsApi = {
    // Get all appointments (admin view)
    list: () => api.get<Appointment[]>('/api/appointments').then(r => r.data),
    
    // Get specific appointment by ID
    get: (id: number) => api.get<Appointment>(`/api/appointments/${id}`).then(r => r.data),
    
    // Create new appointment
    // Links appointment to a medical case, doctor, and patient
    create: (dto: AppointmentDto) => api.post<Appointment>('/api/appointments', dto).then(r => r.data),
    
    // Get all appointments for a specific doctor
    byDoctor: (doctorId: number) =>
        api.get<Appointment[]>('/api/appointments', { params: { doctorId } }).then(r => r.data),
    
    // Get all appointments for a specific patient
    byPatient: (patientId: number) =>
        api.get<Appointment[]>('/api/appointments', { params: { patientId } }).then(r => r.data),

    // Get current user's appointments in a date range
    // Used by both patients and doctors to view their appointments
    // Params: from/to are ISO datetime strings
    my: (from: string, to: string) =>
        api.get<Appointment[]>('/api/appointments/my', { params: { from, to } }).then(r => r.data),

    // Get logged-in patient's appointments in a date range
    myPatient: (from: string, to: string) =>
        api.get('/api/appointments/my', { params: { from, to } }),

    // Get logged-in doctor's appointments in a date range
    myDoctor: (from: string, to: string) =>
        api.get('/api/appointments/my-doctor', { params: { from, to } }),
}