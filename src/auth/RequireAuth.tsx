import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import type { Role } from '../types/api'

export function RequireAuth({ roles }: { roles?: Role[] }) {
    const { user, loading } = useAuth()
    const loc = useLocation()

    if (loading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />

    if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
    return <Outlet />
}