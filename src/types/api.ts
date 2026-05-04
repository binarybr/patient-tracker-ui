// ============================================================================
// Core Type Definitions for Patient Tracker API
// ============================================================================

// User role types - determines access permissions across the application
export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT'

// Authentication response from login/register endpoints
export type AuthResponseDto = {
    accessToken: string      // JWT token for API requests
    refreshToken: string     // Token for refreshing expired access token
    tokenType: string        // Token type (usually 'Bearer')
}

// Login request payload
export type LoginRequestDto = {
    email: string
    password: string
}

// Registration request payload
export type RegisterRequestDto = {
    email: string
    password: string
    role: Role               // Role assigned during registration
}

// Token refresh request payload
export type RefreshRequestDto = {
    refreshToken: string
}

// User information returned from API
export type UserResponseDto = {
    id: number | null
    email: string
    role: Role
    status: string           // e.g., 'ACTIVE', 'INACTIVE'
    doctorId: number | null  // Reference to doctor profile if user is a doctor
    patientId: number | null // Reference to patient profile if user is a patient
}

// Request payload for updating user information
export type UpdateUserRequestDto = {
    role: string
    status: string
    doctorId?: number | null
    patientId?: number | null
}

// Doctor profile information
export type Doctor = {
    id: number
    name: string
    speciality?: string | null      // Medical specialty/field
    hospital?: string | null        // Associated hospital
    address?: string | null
    phone?: string | null
    gender?: string | null
    approved: boolean               // Approval status for clinic access
    deleted: boolean
    createdAt?: string
    updatedAt?: string
}

// Patient profile information
export type Patient = {
    id: number
    name: string
    dob?: string | null             // Date of birth
    address?: string | null
    phone?: string | null
    gender?: string | null
    deleted: boolean
    createdAt?: string
    updatedAt?: string
}

// Request payload for creating/updating patient information
export type PatientDto = {
    name?: string
    dob?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
}

// Medical case: a patient's medical condition under a doctor's care
export type MedicalCase = {
    id: number
    patient: Patient         // Reference to associated patient
    doctor: Doctor           // Reference to treating doctor
    title?: string | null
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
    status: string           // OPEN: ongoing, CLOSED: completed
    createdAt?: string
    updatedAt?: string
}

// Request payload for creating/updating medical case
export type CaseDto = {
    patientId: number
    doctorId: number
    title?: string | null
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
}

// Appointment request payload
export type AppointmentDto = {
    caseId: number
    patientId: number
    doctorId: number
    apptTime: string         // ISO datetime string
    status?: string | null   // e.g., 'SCHEDULED', 'PENDING', 'CANCELLED'
}

// Request payload for creating/updating doctor profile
export type DoctorDto = {
    name: string
    speciality?: string | null
    hospital?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
    approved?: boolean
}

// Appointment details returned from API
export type Appointment = {
    id: number
    medicalCase: MedicalCase // Reference to the medical case
    patient: Patient         // Reference to patient
    doctor: Doctor           // Reference to doctor
    apptTime: string         // ISO datetime string
    status: string
    createdAt?: string
    updatedAt?: string
}

// Days of the week enumeration for doctor availability scheduling
export type DayOfWeek =
    | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
    | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

// Doctor's weekly clinic availability/working hours
export type DoctorAvailability = {
    id: number
    doctor?: Doctor
    dayOfWeek: DayOfWeek
    startTime: string // "HH:mm" or "HH:mm:ss"
    endTime: string   // "HH:mm" or "HH:mm:ss"
    active: boolean   // Whether this availability slot is currently active
}

// Historical version of a medical case for audit trail/change tracking
export type MedicalCaseVersion = {
    id: number
    version: number
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
    createdAt: string
}