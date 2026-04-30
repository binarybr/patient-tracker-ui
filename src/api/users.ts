import { api } from './client'
import type { UserResponseDto, UpdateUserRequestDto } from '../types/api'

export const usersApi = {
    list: () => api.get<UserResponseDto[]>('/api/users').then(r => r.data),
    get: (id: number) => api.get<UserResponseDto>(`/api/users/${id}`).then(r => r.data),
    create: (dto: UpdateUserRequestDto) => api.post<UserResponseDto>('/api/users', dto).then(r => r.data),
    update: (id: number, dto: UpdateUserRequestDto) => api.put<UserResponseDto>(`/api/users/${id}`, dto).then(r => r.data),
    remove: (id: number) => api.delete<void>(`/api/users/${id}`).then(r => r.data),

    linkProfile: (doctorId?: number | null, patientId?: number | null) =>
        api.patch<UserResponseDto>('/api/users/me/link', { doctorId, patientId }).then(r => r.data),

    changePassword: (oldPassword: string, newPassword: string) =>
        api.post<void>('/api/users/me/password', { oldPassword, newPassword }).then(r => r.data),

    me: () => api.get<UserResponseDto>('/api/users/me').then(r => r.data)
}