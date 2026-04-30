export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT'

export type AuthResponseDto = {
    accessToken: string
    refreshToken: string
    tokenType: string
}

export type LoginRequestDto = {
    email: string
    password: string
}

export type RegisterRequestDto = {
    email: string
    password: string
    role: Role
}

export type RefreshRequestDto = {
    refreshToken: string
}

export type UserResponseDto = {
    id: number | null
    email: string
    role: Role
    status: string
    doctorId: number | null
    patientId: number | null
}

export type UpdateUserRequestDto = {
    role: string
    status: string
    doctorId?: number | null
    patientId?: number | null
}

export type Doctor = {
    id: number
    name: string
    speciality?: string | null
    hospital?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
    approved: boolean
    deleted: boolean
    createdAt?: string
    updatedAt?: string
}

export type Patient = {
    id: number
    name: string
    dob?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
    deleted: boolean
    createdAt?: string
    updatedAt?: string
}


export type PatientDto = {
    name?: string
    dob?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
}


export type MedicalCase = {
    id: number
    patient: Patient
    doctor: Doctor
    title?: string | null
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
    status: string // OPEN/CLOSED
    createdAt?: string
    updatedAt?: string
}

export type CaseDto = {
    patientId: number
    doctorId: number
    title?: string | null
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
}

export type AppointmentDto = {
    caseId: number
    patientId: number
    doctorId: number
    apptTime: string // ISO
    status?: string | null
}

export type DoctorDto = {
    name: string
    speciality?: string | null
    hospital?: string | null
    address?: string | null
    phone?: string | null
    gender?: string | null
    approved?: boolean
}


export type Appointment = {
    id: number
    medicalCase: MedicalCase
    patient: Patient
    doctor: Doctor
    apptTime: string
    status: string
    createdAt?: string
    updatedAt?: string
}

export type DayOfWeek =
    | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
    | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export type DoctorAvailability = {
    id: number
    doctor?: Doctor
    dayOfWeek: DayOfWeek
    startTime: string // "HH:mm" or "HH:mm:ss"
    endTime: string   // "HH:mm" or "HH:mm:ss"
    active: boolean
}

export type MedicalCaseVersion = {
    id: number
    version: number
    diagnosis?: string | null
    symptoms?: string | null
    medicines?: string | null
    createdAt: string
}