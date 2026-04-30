import { api } from './client'
import type { Appointment, AppointmentDto } from '../types/api'

export const appointmentsApi = {
    list: () => api.get<Appointment[]>('/api/appointments').then(r => r.data),
    get: (id: number) => api.get<Appointment>(`/api/appointments/${id}`).then(r => r.data),
    create: (dto: AppointmentDto) => api.post<Appointment>('/api/appointments', dto).then(r => r.data),
    byDoctor: (doctorId: number) =>
        api.get<Appointment[]>('/api/appointments', { params: { doctorId } }).then(r => r.data),
    byPatient: (patientId: number) =>
        api.get<Appointment[]>('/api/appointments', { params: { patientId } }).then(r => r.data),

    // patient self query exists (from/to ISO params) [7](https://onedrive.live.com?cid=19333CE569EB65E2&id=19333CE569EB65E2!saff67945e28648349e1dd8c936f704e5)
    my: (from: string, to: string) =>
        api.get<Appointment[]>('/api/appointments/my', { params: { from, to } }).then(r => r.data),


    myPatient: (from: string, to: string) =>
        api.get('/api/appointments/my', { params: { from, to } }),

    myDoctor: (from: string, to: string) =>
        api.get('/api/appointments/my-doctor', { params: { from, to } }),

}