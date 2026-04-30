import React from 'react'
import dayjs from 'dayjs'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '../ui/Page'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useSnack } from '../ui/Snack'
import { appointmentsApi } from '../api/appointments'
import type { Appointment } from '../types/api'

export default function PendingAppointmentsPage() {
    const qc = useQueryClient()
    const snack = useSnack()

    const [selected, setSelected] = React.useState<Appointment | null>(null)
    const [confirmOpen, setConfirmOpen] = React.useState(false)

    // optional quick edit status
    const [statusOpen, setStatusOpen] = React.useState(false)
    const [newStatus, setNewStatus] = React.useState('SCHEDULED')

    const q = useQuery({
        queryKey: ['appointments'],
        queryFn: appointmentsApi.list
    })

    const now = dayjs()

    const rows = React.useMemo(() => {
        const all = q.data ?? []
        return all
            .filter((a) => {
                const st = (a.status || '').toUpperCase()
                const isPending = st === 'SCHEDULED' || st === 'PENDING'
                const future = dayjs(a.apptTime).isAfter(now.subtract(1, 'minute'))
                return isPending && future
            })
            .sort((a, b) => dayjs(a.apptTime).valueOf() - dayjs(b.apptTime).valueOf())
    }, [q.data])

    // If you later add an API endpoint to update appointment status, wire it here.
    // For now: this mutation is a placeholder that just shows the hook pattern.
    const updateStatusMut = useMutation({
        mutationFn: async () => {
            // If backend has PUT/PATCH, replace with real call.
            // Example: return api.patch(`/api/appointments/${id}/status`, { status })
            throw new Error('No appointment status update endpoint wired yet.')
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['appointments'] })
            snack.show('Appointment status updated', 'success')
        }
    })

    const cols: GridColDef<Appointment>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'apptTime',
            headerName: 'Time',
            flex: 1,
            valueGetter: (_, row: Appointment) => dayjs(row.apptTime).format('YYYY-MM-DD HH:mm')
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (p) => <Chip size="small" label={p.row.status} />
        },
        { field: 'doctor', headerName: 'Doctor', flex: 1, valueGetter: (_, row: Appointment) => row.doctor?.name },
        { field: 'patient', headerName: 'Patient', flex: 1, valueGetter: (_, row: Appointment) => row.patient?.name },
        { field: 'case', headerName: 'Case', flex: 1, valueGetter: (_, row: Appointment) => row.medicalCase?.title ?? row.medicalCase?.id },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 260,
            sortable: false,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => { setSelected(p.row); setNewStatus(p.row.status); setStatusOpen(true) }}>
                        Update Status
                    </Button>
                    <Button size="small" color="error" onClick={() => { setSelected(p.row); setConfirmOpen(true) }}>
                        Mark Cancelled
                    </Button>
                </Box>
            )
        }
    ]

    return (
        <>
            <Page
                title="Pending Appointments"
                subtitle="Upcoming appointments with status SCHEDULED/PENDING"
                actions={
                    <Button variant="outlined" onClick={() => qc.invalidateQueries({ queryKey: ['appointments'] })}>
                        Refresh
                    </Button>
                }
            >
                <div style={{ height: 560, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={cols}
                        loading={q.isLoading}
                        getRowId={(r) => r.id}
                        disableRowSelectionOnClick
                    />
                </div>
            </Page>

            <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Update Status</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
                    <TextField label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusOpen(false)}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!selected) return
                            try {
                                await updateStatusMut.mutateAsync()
                                setStatusOpen(false)
                            } catch (e: any) {
                                snack.show(e?.message || 'Status update not wired', 'warning')
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                danger
                title="Mark as Cancelled"
                message="This will mark the appointment as CANCELLED (if endpoint exists). Continue?"
                confirmText="Yes, cancel"
                onClose={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    // Same note: wire real endpoint if you add one
                    snack.show('Cancel endpoint not wired in frontend yet', 'warning')
                }}
            />
        </>
    )
}