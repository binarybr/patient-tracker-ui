import type { Role } from '../types/api'

export type NavItem = { label: string; to: string; roles: Role[] }

export const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },

    { label: 'Doctors', to: '/doctors', roles: ['ADMIN'] },
    { label: 'Patients', to: '/patients', roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Cases', to: '/cases', roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Appointments', to: '/appointments', roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Users', to: '/users', roles: ['ADMIN'] },
    { label: 'Exports', to: '/exports', roles: ['ADMIN'] },

    { label: 'My Appointments', to: '/my-appointments', roles: ['PATIENT'] },
    { label: 'My Export', to: '/exports-mine', roles: ['DOCTOR', 'PATIENT'] },
    { label: 'Pending Appointments', to: '/pending-appointments', roles: ['ADMIN','DOCTOR'] },
    { label: 'Availability', to: '/availability', roles: ['DOCTOR'] }
]