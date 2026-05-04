// ============================================================================
// Local Storage Management for Authentication Tokens
// ============================================================================
// Handles secure storage and retrieval of JWT tokens and role information
// Uses localStorage for persistence across browser sessions

const ACCESS = 'pt_access'   // Key for access token
const REFRESH = 'pt_refresh' // Key for refresh token
const ROLE = 'pt_role'       // Key for user role

/**
 * API for managing authentication tokens in local storage
 * - Access token: short-lived JWT for API requests
 * - Refresh token: long-lived token for obtaining new access tokens
 * - Role: cached user role for quick access
 */
export const authStorage = {
    // Retrieve the current access token
    getAccess: () => localStorage.getItem(ACCESS) || '',
    
    // Retrieve the current refresh token
    getRefresh: () => localStorage.getItem(REFRESH) || '',
    
    // Retrieve the cached user role
    getRole: () => (localStorage.getItem(ROLE) || '') as any,
    
    // Store tokens and optionally role to local storage
    set: (access: string, refresh: string, role?: string) => {
        localStorage.setItem(ACCESS, access)
        localStorage.setItem(REFRESH, refresh)
        if (role) localStorage.setItem(ROLE, role)
    },
    
    // Clear all authentication data from local storage (logout)
    clear: () => {
        localStorage.removeItem(ACCESS)
        localStorage.removeItem(REFRESH)
        localStorage.removeItem(ROLE)
    }
}
