import { api } from './client'
import type { Doctor, DoctorDto } from '../types/api'


export const doctorsApi = {
  // Public / existing CRUD
  list: () => api.get<Doctor[]>('/api/doctors').then(r => r.data),
  get: (id: number) => api.get<Doctor>(`/api/doctors/${id}`).then(r => r.data),
  create: (dto: DoctorDto) => api.post<Doctor>('/api/doctors', dto).then(r => r.data),
  update: (id: number, dto: DoctorDto) => api.put<Doctor>(`/api/doctors/${id}`, dto).then(r => r.data),

  // ✅ Admin actions (matches your AdminController) [2](https://onedrive.live.com?cid=19333CE569EB65E2&id=19333CE569EB65E2!s2f5b6323960e49148ed3f9703a803074)
  approve: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/approve`).then(r => r.data),

  // Requires backend endpoint: PATCH /api/admin/doctors/{id}/reject
  // If you added it, keep this. If not, add it in backend.
  reject: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/reject`).then(r => r.data),

  restore: (id: number) =>
    api.patch<Doctor>(`/api/admin/doctors/${id}/restore`).then(r => r.data),

  // soft=true default, soft=false for hard delete [2](https://onedrive.live.com?cid=19333CE569EB65E2&id=19333CE569EB65E2!s2f5b6323960e49148ed3f9703a803074)
  remove: (id: number, soft = true) =>
    api.delete<void>(`/api/admin/doctors/${id}`, { params: { soft } }).then(r => r.data),
}