import type { Role } from '../types/api'

// Env flags (optional). Default = enabled.
const envBool = (v: any, fallback = true) => {
    if (v === undefined) return fallback
    return String(v).toLowerCase() === 'true'
}

export const featureFlags = {
    doctorAvailability: envBool(import.meta.env.VITE_FEATURE_DOCTOR_AVAILABILITY, true),
    caseHistory: envBool(import.meta.env.VITE_FEATURE_CASE_HISTORY, true),
}

// Role gates per feature
const featureRoles: Record<keyof typeof featureFlags, Role[]> = {
    doctorAvailability: ['DOCTOR'],
    caseHistory: ['ADMIN', 'DOCTOR'],
}

export function canUseFeature(feature: keyof typeof featureFlags, role?: Role) {
    if (!featureFlags[feature]) return false
    if (!role) return false
    return featureRoles[feature].includes(role)
}