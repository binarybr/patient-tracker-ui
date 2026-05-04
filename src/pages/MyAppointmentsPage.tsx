import React from 'react'
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material'
import dayjs from 'dayjs'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { appointmentsApi } from '../api/appointments'
import type { Appointment } from '../types/api'
import Page from '../ui/Page'
import { useAuth } from '../auth/AuthProvider'

// ============================================================================
// My Appointments Page
// ============================================================================
// User-facing view for a doctor or patient to see their own upcoming appointments.
// Supports filtering by date window and handles missing profile linkage errors.

export default function MyAppointmentsPage() {
    const [from, setFrom] = React.useState(dayjs().startOf('day').toISOString())
    const [to, setTo] = React.useState(dayjs().add(30, 'day').endOf('day').toISOString())
    const [rangeKey, setRangeKey] = React.useState(0)

    const { user } = useAuth()

    const q = useQuery<Appointment[]>({
        queryKey: ['myAppointments', rangeKey, from, to, user?.role],
        queryFn: () => appointmentsApi.my(from, to),
        enabled: !!user,
        retry: false
    })

    if (q.isError) {
        const msg =
            (q.error as any)?.response?.data ||
            'Your account is not linked to a profile. Please contact admin or link your profile.'

        return (
            <Page title="My Appointments">
                <Alert severity="warning">{String(msg)}</Alert>
            </Page>
        )
    }

    const cols: GridColDef<Appointment>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'apptTime', headerName: 'Time', flex: 1 },
        { field: 'status', headerName: 'Status', width: 140 },
        {
            field: 'doctor',
            headerName: 'Doctor',
            flex: 1,
            valueGetter: (_, row: Appointment) => row.doctor?.name ?? ''
        },
        {
            field: 'case',
            headerName: 'Case',
            flex: 1,
            valueGetter: (_, row: Appointment) => row.medicalCase?.title ?? ''
        }
    ]

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            <Paper sx={{ p: 2, display: 'grid', gap: 2 }}>
                <Typography variant="h6">My Appointments</Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField label="From (ISO)" value={from} onChange={(e) => setFrom(e.target.value)} fullWidth />
                    <TextField label="To (ISO)" value={to} onChange={(e) => setTo(e.target.value)} fullWidth />
                    <Button variant="contained" onClick={() => setRangeKey((x) => x + 1)}>
                        Fetch
                    </Button>
                </Box>
            </Paper>

            <div style={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={q.data ?? []}
                    columns={cols}
                    loading={q.isLoading}
                    getRowId={(r) => r.id}
                    disableRowSelectionOnClick
                />
            </div>
        </Box>
    )
}