// ============================================================================
// Export API Endpoints
// ============================================================================
// Report generation endpoints that return direct download URLs (.xlsx files)
// No network calls needed - URLs are constructed and browser handles download
// 
// Admin exports:
// - Doctors list
// - Patients list
// - All appointments (system-wide)
// - Doctor appointments (filtered)
// - Patient appointments (filtered)
// 
// User self-service exports:
// - Doctor's own appointments
// - Patient's own appointments

export const exportsApi = {
    // ============================================================================
    // Admin Exports (full data)
    // ============================================================================
    
    /** Export all doctors as Excel file */
    adminDoctorsXlsx: '/api/admin/exports/doctors.xlsx',
    
    /** Export all patients as Excel file */
    adminPatientsXlsx: '/api/admin/exports/patients.xlsx',
    
    /** Export all system appointments as Excel file */
    adminAllApptsXlsx: '/api/admin/exports/appointments.xlsx',
    
    /**
     * Export doctor's appointments as Excel file with optional date filtering
     * @param doctorId - Doctor ID to filter by
     * @param from - Optional start date (ISO format)
     * @param to - Optional end date (ISO format)
     * @param window - Optional time window filter
     */
    adminDoctorApptsXlsx: (doctorId: number, from?: string, to?: string, window?: string) => {
        const p = new URLSearchParams({ doctorId: String(doctorId) })
        if (from) p.set('from', from)
        if (to) p.set('to', to)
        if (window) p.set('window', window)
        return `/api/admin/exports/doctors-appointments.xlsx?${p.toString()}`
    },
    
    /**
     * Export patient's appointments as Excel file with optional date filtering
     * @param patientId - Patient ID to filter by
     * @param from - Optional start date (ISO format)
     * @param to - Optional end date (ISO format)
     * @param window - Optional time window filter
     */
    adminPatientApptsXlsx: (patientId: number, from?: string, to?: string, window?: string) => {
        const p = new URLSearchParams({ patientId: String(patientId) })
        if (from) p.set('from', from)
        if (to) p.set('to', to)
        if (window) p.set('window', window)
        return `/api/admin/exports/patient-appointments.xlsx?${p.toString()}`
    },

    // ============================================================================
    // User Self-Service Exports
    // ============================================================================
    
    /** Export doctor's own appointments as Excel file */
    doctorMyApptsXlsx: '/api/doctor/exports/appointments.xlsx',
    
    /** Export patient's own appointments as Excel file */
    patientMyApptsXlsx: '/api/patient/exports/appointments.xlsx'
}