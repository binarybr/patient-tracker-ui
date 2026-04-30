import { api } from './client'
import type { Patient, PatientDto } from '../types/api'

export const patientsApi = {
    list: () => api.get<Patient[]>('/api/patients').then(r => r.data),
    get: (id: number) => api.get<Patient>(`/api/patients/${id}`).then(r => r.data),
    create: (dto: PatientDto) => api.post<Patient>('/api/patients', dto).then(r => r.data),
    update: (id: number, dto: PatientDto) => api.put<Patient>(`/api/patients/${id}`, dto).then(r => r.data),

    // “self-service PATCH for patients to update their own info” is mentioned in controller docstring. [6](https://onedrive.live.com?cid=19333CE569EB65E2&id=19333CE569EB65E2!s36593dff6f8741beb9d172227ef976d5)
    updateMine: (dto: PatientDto) => api.patch<Patient>('/api/patients/me', dto).then(r => r.data),


    // ✅ Admin actions
    remove: (id: number, soft = true) =>
        api.delete<void>(`/api/admin/patients/${id}`, { params: { soft } }).then(r => r.data),

    restore: (id: number) =>
        api.patch<Patient>(`/api/admin/patients/${id}/restore`).then(r => r.data),

}