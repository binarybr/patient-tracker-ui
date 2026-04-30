export const exportsApi = {
    adminDoctorsXlsx: '/api/admin/exports/doctors.xlsx',
    adminPatientsXlsx: '/api/admin/exports/patients.xlsx',
    adminAllApptsXlsx: '/api/admin/exports/appointments.xlsx',
    adminDoctorApptsXlsx: (doctorId: number, from?: string, to?: string, window?: string) => {
        const p = new URLSearchParams({ doctorId: String(doctorId) })
        if (from) p.set('from', from)
        if (to) p.set('to', to)
        if (window) p.set('window', window)
        return `/api/admin/exports/doctors-appointments.xlsx?${p.toString()}`
    },
    adminPatientApptsXlsx: (patientId: number, from?: string, to?: string, window?: string) => {
        const p = new URLSearchParams({ patientId: String(patientId) })
        if (from) p.set('from', from)
        if (to) p.set('to', to)
        if (window) p.set('window', window)
        return `/api/admin/exports/patient-appointments.xlsx?${p.toString()}`
    },

    doctorMyApptsXlsx: '/api/doctor/exports/appointments.xlsx',
    patientMyApptsXlsx: '/api/patient/exports/appointments.xlsx'
}