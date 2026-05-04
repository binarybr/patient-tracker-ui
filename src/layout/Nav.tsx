import type { Role } from '../types/api'

// ============================================================================
// Navigation Configuration and Items
// ============================================================================
// Defines the application navigation structure with role-based visibility
// Each navigation item specifies:
// - Label: display text
// - Path: route to navigate to
// - Roles: which user roles can access this item

/**
 * Navigation item interface
 * Includes role-based access control for menu items
 */
export type NavItem = { label: string; to: string; roles: Role[] }

/**
 * Main navigation menu items
 * Filtered based on user role in AppShell component
 * Routes are grouped by their primary access level
 */
export const navItems: NavItem[] = [
    // Dashboard - accessible to all authenticated users
    { label: 'Dashboard', to: '/', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },

    // ADMIN section - doctor management
    { label: 'Doctors', to: '/doctors', roles: ['ADMIN'] },
    
    // ADMIN and DOCTOR section - patient and case management
    { label: 'Patients', to: '/patients', roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Cases', to: '/cases', roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Appointments', to: '/appointments', roles: ['ADMIN', 'DOCTOR'] },
    
    // ADMIN only - system management
    { label: 'Users', to: '/users', roles: ['ADMIN'] },
    { label: 'Exports', to: '/exports', roles: ['ADMIN'] },

    // Patient only - personal schedule
    { label: 'My Appointments', to: '/my-appointments', roles: ['PATIENT'] },
    
    // Doctor and Patient - personal exports
    { label: 'My Export', to: '/exports-mine', roles: ['DOCTOR', 'PATIENT'] },
    
    // Admin and Doctor - pending appointments review
    { label: 'Pending Appointments', to: '/pending-appointments', roles: ['ADMIN','DOCTOR'] },
    
    // Doctor only - availability/schedule management
    { label: 'Availability', to: '/availability', roles: ['DOCTOR'] }
]