import { api } from './client'
import type {
    AuthResponseDto,
    LoginRequestDto,
    RegisterRequestDto,
    RefreshRequestDto,
    UserResponseDto
} from '../types/api'

// ============================================================================
// Authentication API Endpoints
// ============================================================================
// Provides methods for user authentication including:
// - Login and registration
// - Token refresh
// - Current user information retrieval

export const authApi = {
    // User login with email and password
    // Returns: access token, refresh token, token type
    login: (body: LoginRequestDto) => api.post<AuthResponseDto>('/api/auth/login', body).then(r => r.data),
    
    // User registration with email, password, and role
    // Returns: access token, refresh token, token type
    register: (body: RegisterRequestDto) => api.post<AuthResponseDto>('/api/auth/register', body).then(r => r.data),
    
    // Refresh expired access token using refresh token
    // Returns: new access token and refresh token
    refresh: (body: RefreshRequestDto) => api.post<AuthResponseDto>('/api/auth/refresh', body).then(r => r.data),
    
    // Get current authenticated user's information
    // Returns: user id, email, role, status, linked doctor/patient IDs
    me: () => api.get<UserResponseDto>('/api/users/me').then(r => r.data)
}