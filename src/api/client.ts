import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStorage } from '../auth/authStorage'
import type { AuthResponseDto } from '../types/api'

export const api = axios.create({
    baseURL: '', // uses Vite proxy for /api
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authStorage.getAccess()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

let refreshing = false
let waiters: Array<(token: string) => void> = []

function notifyWaiters(token: string) {
    waiters.forEach((cb) => cb(token))
    waiters = []
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as any
        const status = error.response?.status

        if (status !== 401 || original?._retry) {
            throw error
        }
        original._retry = true

        if (refreshing) {
            return new Promise((resolve) => {
                waiters.push((token) => {
                    original.headers.Authorization = `Bearer ${token}`
                    resolve(api(original))
                })
            })
        }

        refreshing = true
        try {
            const refreshToken = authStorage.getRefresh()
            if (!refreshToken) throw error

            // Adjust this path if your backend uses a different refresh route
            const r = await axios.post<AuthResponseDto>('/api/auth/refresh', { refreshToken })
            authStorage.set(r.data.accessToken, r.data.refreshToken)
            notifyWaiters(r.data.accessToken)

            original.headers.Authorization = `Bearer ${r.data.accessToken}`
            return api(original)
        } catch (e) {
            authStorage.clear()
            throw error
        } finally {
            refreshing = false
        }
    }
)