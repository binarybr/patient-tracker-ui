import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import type { Role } from '../types/api'

// ============================================================================
// Protected Route Component (RequireAuth)
// ============================================================================
// Implements role-based route protection:
// - Redirects unauthenticated users to login
// - Redirects unauthorized users to unauthorized page
// - Allows authenticated users with correct role to access route
// - Returns nested routes with <Outlet />

/**
 * RequireAuth Component
 * Route guard that enforces authentication and authorization
 * 
 * Flow:
 * 1. While loading auth state, returns null (loading screen)
 * 2. If no user, redirects to /login
 * 3. If user role not in allowed roles, redirects to /unauthorized
 * 4. Otherwise, renders nested routes with <Outlet />
 * 
 * Usage:
 * - <Route element={<RequireAuth />} > - requires login only
 * - <Route element={<RequireAuth roles={['ADMIN']} />} > - requires ADMIN role
 * - <Route element={<RequireAuth roles={['ADMIN', 'DOCTOR']} />} > - requires ADMIN or DOCTOR role
 */
export function RequireAuth({ roles }: { roles?: Role[] }) {
    const { user, loading } = useAuth()
    const loc = useLocation()

    // Wait for authentication state to load
    if (loading) return null
    
    // Not authenticated - redirect to login page
    if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />

    // Authenticated but unauthorized - redirect to unauthorized page
    if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
    
    // Authenticated and authorized - render nested route
    return <Outlet />
}