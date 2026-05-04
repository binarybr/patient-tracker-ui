import { api } from './client'
import type { DoctorAvailability } from '../types/api'

// ============================================================================
// Doctor Availability API Endpoints
// ============================================================================
// Doctor schedule management:
// - Doctors define their available hours for appointments
// - Each availability slot covers a day of week with start/end times
// - Slots can be enabled/disabled without deletion

/**
 * Data transfer object for creating availability slots
 * Specifies when a doctor is available for appointments
 */
export type CreateAvailabilityDto = {
    dayOfWeek: DoctorAvailability['dayOfWeek']  // Day of week (MONDAY, TUESDAY, etc.)
    startTime: string                             // Start time (e.g., "09:00")
    endTime: string                               // End time (e.g., "17:00")
    active?: boolean                              // Whether slot is currently active (defaults to true)
}

export const doctorAvailabilityApi = {
    // ============================================================================
    // Availability Management
    // ============================================================================
    
    /** Get current doctor's availability schedule */
    my: () =>
        api.get<DoctorAvailability[]>('/api/doctor-availability/my').then(r => r.data),

    /** Create new availability slot for current doctor */
    // Automatically sets active=true if not specified
    create: (dto: CreateAvailabilityDto) =>
        api.post<DoctorAvailability>('/api/doctor-availability', {
            ...dto,
            active: dto.active ?? true
        }).then(r => r.data),

    // Optional future endpoints if backend adds them:
    // update: (id: number, dto: Partial<CreateAvailabilityDto>) =>
    //   api.put<DoctorAvailability>(`/api/doctor-availability/${id}`, dto).then(r => r.data),
    // remove: (id: number) =>
    //   api.delete<void>(`/api/doctor-availability/${id}`).then(r => r.data),
}