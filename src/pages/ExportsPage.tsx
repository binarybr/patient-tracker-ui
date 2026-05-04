import React from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { exportsApi } from '../api/exports'
import { useAuth } from '../auth/AuthProvider'

// ============================================================================
// Exports Page
// ============================================================================
// Provides direct Excel export links for admins or current user role exports.
// Admin mode supports full system exports and filtered doctor/patient appointment exports.

export default function ExportsPage({ mode }: { mode: 'ADMIN' | 'MINE' }) {
    const { user } = useAuth()
    const [doctorId, setDoctorId] = React.useState('')
    const [patientId, setPatientId] = React.useState('')

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Exports</Typography>

            {mode === 'ADMIN' && (
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Button component="a" href={exportsApi.adminDoctorsXlsx} target="_blank" rel="noreferrer" variant="contained">
                        Download Doctors.xlsx
                    </Button>
                    <Button component="a" href={exportsApi.adminPatientsXlsx} target="_blank" rel="noreferrer" variant="contained">
                        Download Patients.xlsx
                    </Button>
                    <Button component="a" href={exportsApi.adminAllApptsXlsx} target="_blank" rel="noreferrer" variant="contained">
                        Download Appointments.xlsx
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        <TextField label="Doctor ID" value={doctorId} onChange={e => setDoctorId(e.target.value)} />
                        <Button
                            component="a"
                            href={exportsApi.adminDoctorApptsXlsx(Number(doctorId || 0), undefined, undefined, 'history')}
                            target="_blank"
                            rel="noreferrer"
                            disabled={!doctorId}
                        >
                            Doctor Appointments (history)
                        </Button>
                        <Button
                            component="a"
                            href={exportsApi.adminDoctorApptsXlsx(Number(doctorId || 0), undefined, undefined, 'upcoming')}
                            target="_blank"
                            rel="noreferrer"
                            disabled={!doctorId}
                        >
                            Doctor Appointments (upcoming)
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
                        <Button
                            component="a"
                            href={exportsApi.adminPatientApptsXlsx(Number(patientId || 0), undefined, undefined, 'history')}
                            target="_blank"
                            rel="noreferrer"
                            disabled={!patientId}
                        >
                            Patient Appointments (history)
                        </Button>
                    </Box>
                </Box>
            )}

            {mode === 'MINE' && (
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Typography>Logged as {user?.role}</Typography>

                    {user?.role === 'DOCTOR' && (
                        <Button component="a" href={exportsApi.doctorMyApptsXlsx} target="_blank" rel="noreferrer" variant="contained">
                            Download My Appointments.xlsx
                        </Button>
                    )}

                    {user?.role === 'PATIENT' && (
                        <Button component="a" href={exportsApi.patientMyApptsXlsx} target="_blank" rel="noreferrer" variant="contained">
                            Download My Appointments.xlsx
                        </Button>
                    )}
                </Box>
            )}
        </Paper>
    )
}