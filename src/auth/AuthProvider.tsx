import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { authStorage } from './authStorage'
import type { Role, UserResponseDto } from '../types/api'

type AuthState = {
    user: UserResponseDto | null
    role: Role | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, role: Role) => Promise<void>
    logout: () => void
    refreshMe: () => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponseDto | null>(null)
    const [loading, setLoading] = useState(true)

    const role = (user?.role ?? null) as Role | null

    async function refreshMe() {
        const me = await authApi.me()
        setUser(me)
    }

    async function login(email: string, password: string) {
        const res = await authApi.login({ email, password })
        authStorage.set(res.accessToken, res.refreshToken)
        await refreshMe()
    }

    async function register(email: string, password: string, role: Role) {
        const res = await authApi.register({ email, password, role })
        authStorage.set(res.accessToken, res.refreshToken, role)
        await refreshMe()
    }

    function logout() {
        authStorage.clear()
        setUser(null)
    }

    useEffect(() => {
        (async () => {
            try {
                if (authStorage.getAccess()) await refreshMe()
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const value = useMemo<AuthState>(() => ({
        user, role, loading, login, register, logout, refreshMe
    }), [user, role, loading])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('AuthProvider missing')
    return ctx
}