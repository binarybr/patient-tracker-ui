import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStorage } from '../auth/authStorage'
import type { AuthResponseDto } from '../types/api'

// ============================================================================
// Axios HTTP Client with Token Refresh Logic
// ============================================================================
// Provides a configured axios instance with:
// - Bearer token injection on every request
// - Automatic token refresh on 401 (Unauthorized) responses
// - Request queue management during token refresh

/**
 * Main axios instance for API requests
 * - Uses Vite dev proxy for /api requests
 * - Configured with JSON content type headers
 */
export const api = axios.create({
    baseURL: '', // uses Vite proxy for /api
    headers: { 'Content-Type': 'application/json' }
})

/**
 * Request Interceptor: Add Bearer token to all requests
 * - Retrieves access token from local storage
 * - Injects it in Authorization header if present
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authStorage.getAccess()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Token refresh state management
let refreshing = false                           // Flag to prevent multiple simultaneous refresh calls
let waiters: Array<(token: string) => void> = [] // Queue of pending requests waiting for new token

/**
 * Notify all pending requests with the new access token
 * Allows them to retry with the refreshed token
 */
function notifyWaiters(token: string) {
    waiters.forEach((cb) => cb(token))
    waiters = []
}

/**
 * Response Interceptor: Handle token refresh on 401 errors
 * Flow:
 * 1. If 401 error and not already retried, attempt token refresh
 * 2. If refresh is already in progress, queue the request
 * 3. If refresh succeeds, update tokens and retry the original request
 * 4. If refresh fails, clear auth and throw error
 */
api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as any
        const status = error.response?.status

        // Only handle 401 errors and prevent infinite retry loops
        if (status !== 401 || original?._retry) {
            throw error
        }
        original._retry = true

        // If token refresh is already in progress, queue this request
        if (refreshing) {
            return new Promise((resolve) => {
                waiters.push((token) => {
                    original.headers.Authorization = `Bearer ${token}`
                    resolve(api(original))
                })
            })
        }

        // Begin token refresh process
        refreshing = true
        try {
            const refreshToken = authStorage.getRefresh()
            if (!refreshToken) throw error

            // Call token refresh endpoint with refresh token
            const r = await axios.post<AuthResponseDto>('/api/auth/refresh', { refreshToken })
            
            // Update stored tokens with new values
            authStorage.set(r.data.accessToken, r.data.refreshToken)
            
            // Notify all queued requests with new token
            notifyWaiters(r.data.accessToken)

            // Retry original request with new token
            original.headers.Authorization = `Bearer ${r.data.accessToken}`
            return api(original)
        } catch (e) {
            // If refresh fails, clear auth and logout user
            authStorage.clear()
            throw error
        } finally {
            // Reset refresh state
            refreshing = false
        }
    }
)