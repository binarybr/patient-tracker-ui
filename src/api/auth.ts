import { api } from './client'
import type {
    AuthResponseDto,
    LoginRequestDto,
    RegisterRequestDto,
    RefreshRequestDto,
    UserResponseDto
} from '../types/api'

export const authApi = {
    login: (body: LoginRequestDto) => api.post<AuthResponseDto>('/api/auth/login', body).then(r => r.data),
    register: (body: RegisterRequestDto) => api.post<AuthResponseDto>('/api/auth/register', body).then(r => r.data),
    refresh: (body: RefreshRequestDto) => api.post<AuthResponseDto>('/api/auth/refresh', body).then(r => r.data),
    me: () => api.get<UserResponseDto>('/api/users/me').then(r => r.data)
}