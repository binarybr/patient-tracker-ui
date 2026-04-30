import * as React from 'react'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientsApi } from '../api/patients'
import type { Patient, PatientDto } from '../types/api'
import ConfirmDialog from '../ui/ConfirmDialog'
import HardDeleteDialog from '../ui/HardDeleteDialog'
import { useSnack } from '../ui/Snack'
import { Typography } from '@mui/material'

export default function PatientsPage() {
    const qc = useQueryClient()
    const snack = useSnack()

    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<Patient | null>(null)

    const [confirmSoftOpen, setConfirmSoftOpen] = React.useState(false)
    const [confirmRestoreOpen, setConfirmRestoreOpen] = React.useState(false)
    const [confirmHardOpen, setConfirmHardOpen] = React.useState(false)
    const [target, setTarget] = React.useState<Patient | null>(null)

    const [form, setForm] = React.useState<PatientDto>({
        name: '',
        dob: '',
        address: '',
        phone: '',
        gender: ''
    })

    const q = useQuery({ queryKey: ['patients'], queryFn: patientsApi.list })
    const refresh = () => qc.invalidateQueries({ queryKey: ['patients'] })

    const createMut = useMutation({
        mutationFn: (dto: PatientDto) => patientsApi.create(dto),
        onSuccess: () => { snack.show('Patient created', 'success'); refresh() }
    })

    const updateMut = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: PatientDto }) => patientsApi.update(id, dto),
        onSuccess: () => { snack.show('Patient updated', 'success'); refresh() }
    })

    const softDeleteMut = useMutation({
        mutationFn: (id: number) => patientsApi.remove(id, true),
        onSuccess: () => { snack.show('Patient soft deleted', 'warning'); refresh() }
    })

    const restoreMut = useMutation({
        mutationFn: (id: number) => patientsApi.restore(id),
        onSuccess: () => { snack.show('Patient restored', 'success'); refresh() }
    })

    const hardDeleteMut = useMutation({
        mutationFn: (id: number) => patientsApi.remove(id, false),
        onSuccess: () => { snack.show('Patient permanently deleted', 'success'); refresh() }
    })

    const statusChip = (p: Patient) => {
        if (p.deleted) return <Chip label="Deleted" color="error" size="small" />
        return <Chip label="Active" color="success" size="small" />
    }

    const cols: GridColDef<Patient>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'dob', headerName: 'DOB', width: 140 },
        { field: 'phone', headerName: 'Phone', width: 160 },
        { field: 'gender', headerName: 'Gender', width: 110 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (p) => statusChip(p.row)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 520,
            sortable: false,
            renderCell: (p) => {
                const row = p.row
                return (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            size="small"
                            disabled={row.deleted}
                            onClick={() => {
                                setEditing(row)
                                setForm({
                                    name: row.name ?? '',
                                    dob: row.dob ?? '',
                                    address: row.address ?? '',
                                    phone: row.phone ?? '',
                                    gender: row.gender ?? ''
                                })
                                setOpen(true)
                            }}
                        >
                            Edit
                        </Button>

                        {!row.deleted && (
                            <Button
                                size="small"
                                color="error"
                                onClick={() => { setTarget(row); setConfirmSoftOpen(true) }}
                            >
                                Delete (Soft)
                            </Button>
                        )}

                        {row.deleted && (
                            <>
                                <Button
                                    size="small"
                                    color="info"
                                    onClick={() => { setTarget(row); setConfirmRestoreOpen(true) }}
                                >
                                    Restore
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => { setTarget(row); setConfirmHardOpen(true) }}
                                >
                                    Delete Permanently
                                </Button>
                            </>
                        )}
                    </Box>
                )
            }
        }
    ]

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Header + actions */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Typography variant="h5">Patients</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Admin patient management (soft delete, restore, hard delete)
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEditing(null)
                        setForm({
                            name: '',
                            dob: '',
                            address: '',
                            phone: '',
                            gender: ''
                        })
                        setOpen(true)
                    }}
                >
                    Add Patient
                </Button>
            </Box>


            <div style={{ height: 560, width: '100%' }}>
                <DataGrid
                    rows={q.data ?? []}
                    columns={cols}
                    loading={q.isLoading}
                    getRowId={(r) => r.id}
                    disableRowSelectionOnClick
                />
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? 'Edit Patient' : 'Create Patient'}</DialogTitle>
                <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <TextField label="DOB (YYYY-MM-DD)" value={form.dob ?? ''} onChange={e => setForm({ ...form, dob: e.target.value })} />
                    <TextField label="Phone" value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <TextField label="Gender" value={form.gender ?? ''} onChange={e => setForm({ ...form, gender: e.target.value })} />
                    <TextField label="Address" value={form.address ?? ''} onChange={e => setForm({ ...form, address: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={async () => {
                        if (!form.name?.trim()) return
                        if (editing) await updateMut.mutateAsync({ id: editing.id, dto: form })
                        else await createMut.mutateAsync(form)
                        setOpen(false)
                    }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Soft Delete Confirm */}
            <ConfirmDialog
                open={confirmSoftOpen}
                danger
                title="Soft delete patient?"
                message={`Soft delete "${target?.name}"? You can restore later.`}
                confirmText="Soft Delete"
                onClose={() => setConfirmSoftOpen(false)}
                onConfirm={async () => { if (target) await softDeleteMut.mutateAsync(target.id) }}
            />

            {/* Restore Confirm */}
            <ConfirmDialog
                open={confirmRestoreOpen}
                title="Restore patient?"
                message={`Restore "${target?.name}"?`}
                confirmText="Restore"
                onClose={() => setConfirmRestoreOpen(false)}
                onConfirm={async () => { if (target) await restoreMut.mutateAsync(target.id) }}
            />

            {/* Hard Delete Dialog */}
            <HardDeleteDialog
                open={confirmHardOpen}
                entityLabel={target ? `${target.name} (ID: ${target.id})` : 'Patient'}
                onClose={() => setConfirmHardOpen(false)}
                onConfirm={async () => { if (target) await hardDeleteMut.mutateAsync(target.id) }}
            />
        </Box>
    )
}