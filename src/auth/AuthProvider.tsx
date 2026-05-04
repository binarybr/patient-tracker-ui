import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { authStorage } from './authStorage'
import type { Role, UserResponseDto } from '../types/api'

// ============================================================================
// Authentication Context and Provider
// ============================================================================
// Manages global authentication state including:
// - Current user information
// - User role
// - Login/logout/register operations
// - Token management and refresh logic

type AuthState = {
    user: UserResponseDto | null              // Currently authenticated user or null
    role: Role | null                         // User's role for permission checks
    loading: boolean                          // Loading state during initial auth check
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, role: Role) => Promise<void>
    logout: () => void
    refreshMe: () => Promise<void>            // Refresh current user from API
}

const Ctx = createContext<AuthState | null>(null)

/**
 * AuthProvider Component
 * - Wraps the application to provide authentication context
 * - Initializes auth state on app startup
 * - Handles login, register, and logout operations
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponseDto | null>(null)
    const [loading, setLoading] = useState(true)

    // Derive role from current user data
    const role = (user?.role ?? null) as Role | null

    /**
     * Fetch and update current user information from API
     * Called after successful login/register or on app startup
     */
    async function refreshMe() {
        const me = await authApi.me()
        setUser(me)
    }

    /**
     * Login user with email and password
     * - Calls auth API
     * - Stores tokens locally
     * - Fetches user data
     */
    async function login(email: string, password: string) {
        const res = await authApi.login({ email, password })
        authStorage.set(res.accessToken, res.refreshToken)
        await refreshMe()
    }

    /**
     * Register new user
     * - Calls auth API
     * - Stores tokens and role locally
     * - Fetches user data
     */
    async function register(email: string, password: string, role: Role) {
        const res = await authApi.register({ email, password, role })
        authStorage.set(res.accessToken, res.refreshToken, role)
        await refreshMe()
    }

    /**
     * Logout user
     * - Clears tokens and user data
     * - User will be redirected to login by RequireAuth component
     */
    function logout() {
        authStorage.clear()
        setUser(null)
    }

    /**
     * Initialize authentication on app startup
     * - Checks if user has valid token in storage
     * - If yes, fetches user data to verify token validity
     * - Sets loading to false when complete (regardless of success)
     */
    useEffect(() => {
        (async () => {
            try {
                if (authStorage.getAccess()) await refreshMe()
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo<AuthState>(() => ({
        user, role, loading, login, register, logout, refreshMe
    }), [user, role, loading])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 * Throws error if used outside of AuthProvider
 */
export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('AuthProvider missing')
    return ctx
}