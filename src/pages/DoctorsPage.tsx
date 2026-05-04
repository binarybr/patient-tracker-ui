import React from 'react'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { doctorsApi } from '../api/doctors'
import type { Doctor, DoctorDto } from '../types/api'
import ConfirmDialog from '../ui/ConfirmDialog'
import HardDeleteDialog from '../ui/HardDeleteDialog'
import { useSnack } from '../ui/Snack'
import { Typography } from '@mui/material'

// ============================================================================
// Doctors Management Page
// ============================================================================
// Admin interface for managing doctor profiles, approval workflow, and deletion.
// Includes filtering by status, edit/create dialog, soft delete, restore, and hard delete.

type DoctorFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'DELETED'

export default function DoctorsPage() {
    const qc = useQueryClient()
    const snack = useSnack()

    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<Doctor | null>(null)

    // Filter toggle
    const [filter, setFilter] = React.useState<DoctorFilter>('ALL')

    // Confirm dialogs
    const [confirmSoftOpen, setConfirmSoftOpen] = React.useState(false)
    const [confirmRestoreOpen, setConfirmRestoreOpen] = React.useState(false)
    const [confirmHardOpen, setConfirmHardOpen] = React.useState(false)
    const [confirmRejectOpen, setConfirmRejectOpen] = React.useState(false)

    const [target, setTarget] = React.useState<Doctor | null>(null)

    const [form, setForm] = React.useState<DoctorDto>({
        name: '',
        speciality: '',
        hospital: '',
        address: '',
        phone: '',
        gender: '',
        approved: false
    })

    const q = useQuery({ queryKey: ['doctors'], queryFn: doctorsApi.list })
    const refresh = () => qc.invalidateQueries({ queryKey: ['doctors'] })

    const createMut = useMutation({
        mutationFn: (dto: DoctorDto) => doctorsApi.create(dto),
        onSuccess: () => { snack.show('Doctor created', 'success'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Create failed'), 'error')
    })

    const updateMut = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: DoctorDto }) => doctorsApi.update(id, dto),
        onSuccess: () => { snack.show('Doctor updated', 'success'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Update failed'), 'error')
    })

    const approveMut = useMutation({
        mutationFn: (id: number) => doctorsApi.approve(id),
        onSuccess: () => { snack.show('Doctor approved', 'success'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Approve failed'), 'error')
    })

    const rejectMut = useMutation({
        mutationFn: (id: number) => doctorsApi.reject(id),
        onSuccess: () => { snack.show('Doctor rejected', 'warning'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Reject failed'), 'error')
    })

    const softDeleteMut = useMutation({
        mutationFn: (id: number) => doctorsApi.remove(id, true),
        onSuccess: () => { snack.show('Doctor soft deleted', 'warning'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Delete failed'), 'error')
    })

    const restoreMut = useMutation({
        mutationFn: (id: number) => doctorsApi.restore(id),
        onSuccess: () => { snack.show('Doctor restored', 'success'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Restore failed'), 'error')
    })

    const hardDeleteMut = useMutation({
        mutationFn: (id: number) => doctorsApi.remove(id, false),
        onSuccess: () => { snack.show('Doctor permanently deleted', 'success'); refresh() },
        onError: (e: any) => snack.show(String(e?.response?.data ?? 'Hard delete failed'), 'error')
    })

    const statusChip = (d: Doctor) => {
        if (d.deleted) return <Chip label="Deleted" color="error" size="small" />
        if (d.approved) return <Chip label="Approved" color="success" size="small" />
        return <Chip label="Pending" color="warning" size="small" />
    }

    const filteredRows = React.useMemo(() => {
        const all = q.data ?? []
        switch (filter) {
            case 'PENDING':
                return all.filter(d => !d.deleted && !d.approved)
            case 'APPROVED':
                return all.filter(d => !d.deleted && d.approved)
            case 'DELETED':
                return all.filter(d => d.deleted)
            default:
                return all
        }
    }, [q.data, filter])

    const cols: GridColDef<Doctor>[] = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'speciality', headerName: 'Speciality', flex: 1 },
        { field: 'hospital', headerName: 'Hospital', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'gender', headerName: 'Gender', width: 110 },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (p) => statusChip(p.row)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 560,
            sortable: false,
            renderCell: (p) => {
                const d = p.row

                return (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>                        
                        {/* Edit disabled for deleted doctors */}
                        <Button
                            size="small"
                            disabled={d.deleted}
                            onClick={() => {
                                setEditing(d)
                                setForm({
                                    name: d.name,
                                    speciality: d.speciality ?? '',
                                    hospital: d.hospital ?? '',
                                    address: d.address ?? '',
                                    phone: d.phone ?? '',
                                    gender: d.gender ?? '',
                                    approved: !!d.approved
                                })
                                setOpen(true)
                            }}
                        >
                            Edit
                        </Button>

                        {/* Approve: only for pending and not deleted */}
                        {!d.approved && !d.deleted && (
                            <Button size="small" color="success" onClick={() => approveMut.mutate(d.id)}>
                                Approve
                            </Button>
                        )}

                        {/* Reject: only for approved and not deleted */}
                        {d.approved && !d.deleted && (
                            <Button
                                size="small"
                                color="warning"
                                onClick={() => { setTarget(d); setConfirmRejectOpen(true) }}
                            >
                                Reject
                            </Button>
                        )}

                        {/* Soft delete: only if not deleted */}
                        {!d.deleted && (
                            <Button
                                size="small"
                                color="error"
                                onClick={() => { setTarget(d); setConfirmSoftOpen(true) }}
                            >
                                Delete (Soft)
                            </Button>
                        )}

                        {/* Restore + Hard delete: only if deleted */}
                        {d.deleted && (
                            <>
                                <Button
                                    size="small"
                                    color="info"
                                    onClick={() => { setTarget(d); setConfirmRestoreOpen(true) }}
                                >
                                    Restore
                                </Button>

                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => { setTarget(d); setConfirmHardOpen(true) }}
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
            {/* Top actions */}

            <Box>
                <Typography variant="h5">Doctors</Typography>
                <Typography variant="body2" color="text.secondary">
                    Admin doctor management
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditing(null)
                        setForm({ name: '', speciality: '', hospital: '', address: '', phone: '', gender: '', approved: false })
                        setOpen(true)
                    }}
                >
                    Add Doctor
                </Button>

                {/* Filter toggle */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(['ALL', 'PENDING', 'APPROVED', 'DELETED'] as const).map(k => (
                        <Button
                            key={k}
                            size="small"
                            variant={filter === k ? 'contained' : 'outlined'}
                            onClick={() => setFilter(k)}
                        >
                            {k}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Grid */}
            <div style={{ height: 560, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={cols}
                    loading={q.isLoading}
                    getRowId={(r) => r.id}
                    disableRowSelectionOnClick
                />
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? 'Edit Doctor' : 'Create Doctor'}</DialogTitle>
                <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <TextField label="Speciality" value={form.speciality ?? ''} onChange={e => setForm({ ...form, speciality: e.target.value })} />
                    <TextField label="Hospital" value={form.hospital ?? ''} onChange={e => setForm({ ...form, hospital: e.target.value })} />
                    <TextField label="Address" value={form.address ?? ''} onChange={e => setForm({ ...form, address: e.target.value })} />
                    <TextField label="Phone" value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <TextField label="Gender" value={form.gender ?? ''} onChange={e => setForm({ ...form, gender: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!form.name.trim()) return
                            if (editing) await updateMut.mutateAsync({ id: editing.id, dto: form })
                            else await createMut.mutateAsync(form)
                            setOpen(false)
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject confirm */}
            <ConfirmDialog
                open={confirmRejectOpen}
                danger
                title="Reject doctor?"
                message={`Reject "${target?.name}"? This will mark doctor as NOT approved.`}
                confirmText="Reject"
                onClose={() => setConfirmRejectOpen(false)}
                onConfirm={async () => {
                    if (!target) return
                    await rejectMut.mutateAsync(target.id)
                }}
            />

            {/* Soft delete confirm */}
            <ConfirmDialog
                open={confirmSoftOpen}
                danger
                title="Soft delete doctor?"
                message={`Soft delete "${target?.name}"? You can restore later.`}
                confirmText="Soft Delete"
                onClose={() => setConfirmSoftOpen(false)}
                onConfirm={async () => {
                    if (!target) return
                    await softDeleteMut.mutateAsync(target.id)
                }}
            />

            {/* Restore confirm */}
            <ConfirmDialog
                open={confirmRestoreOpen}
                title="Restore doctor?"
                message={`Restore "${target?.name}"?`}
                confirmText="Restore"
                onClose={() => setConfirmRestoreOpen(false)}
                onConfirm={async () => {
                    if (!target) return
                    await restoreMut.mutateAsync(target.id)
                }}
            />

            {/* Hard delete dialog (type DELETE) */}
            <HardDeleteDialog
                open={confirmHardOpen}
                entityLabel={target ? `${target.name} (ID: ${target.id})` : 'Doctor'}
                onClose={() => setConfirmHardOpen(false)}
                onConfirm={async () => {
                    if (!target) return
                    await hardDeleteMut.mutateAsync(target.id)
                }}
            />
        </Box>
    )
}