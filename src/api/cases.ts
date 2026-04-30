import { api } from './client'
import type { MedicalCase, CaseDto, MedicalCaseVersion } from '../types/api'

export const casesApi = {
    list: () => api.get<MedicalCase[]>('/api/cases').then(r => r.data),
    get: (id: number) => api.get<MedicalCase>(`/api/cases/${id}`).then(r => r.data),
    create: (dto: CaseDto) => api.post<MedicalCase>('/api/cases', dto).then(r => r.data),
    update: (id: number, dto: Partial<CaseDto & { status: string }>) =>
        api.put<MedicalCase>(`/api/cases/${id}`, dto).then(r => r.data),
    remove: (id: number) => api.delete<void>(`/api/cases/${id}`).then(r => r.data),

    versions: (caseId: number) =>
        api.get<MedicalCaseVersion[]>(`/api/cases/${caseId}/versions`).then(r => r.data),

    // controller mentions status update operation [7](https://onedrive.live.com?cid=19333CE569EB65E2&id=19333CE569EB65E2!saff67945e28648349e1dd8c936f704e5)
    setStatus: (id: number, status: string) =>
        api.patch<MedicalCase>(`/api/cases/${id}/status`, { status }).then(r => r.data),
}