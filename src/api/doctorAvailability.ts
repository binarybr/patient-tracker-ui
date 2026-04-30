import { api } from './client'
import type { DoctorAvailability } from '../types/api'

export type CreateAvailabilityDto = {
    dayOfWeek: DoctorAvailability['dayOfWeek']
    startTime: string
    endTime: string
    active?: boolean
}

export const doctorAvailabilityApi = {
    my: () =>
        api.get<DoctorAvailability[]>('/api/doctor-availability/my').then(r => r.data),

    create: (dto: CreateAvailabilityDto) =>
        api.post<DoctorAvailability>('/api/doctor-availability', {
            ...dto,
            active: dto.active ?? true
        }).then(r => r.data),

    // Optional future endpoints if you add them on backend:
    // update: (id: number, dto: Partial<CreateAvailabilityDto>) =>
    //   api.put<DoctorAvailability>(`/api/doctor-availability/${id}`, dto).then(r => r.data),
    // remove: (id: number) =>
    //   api.delete<void>(`/api/doctor-availability/${id}`).then(r => r.data),
}