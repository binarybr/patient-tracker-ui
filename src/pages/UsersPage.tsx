import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '../ui/Page'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useSnack } from '../ui/Snack'
import { usersApi } from '../api/users'
import type { Role, UserResponseDto, UpdateUserRequestDto } from '../types/api'

// ============================================================================
// User Management Page
// ============================================================================
// Admin-facing table for managing user accounts.
// Supports listing users, creating new accounts, editing roles/status, and deletion.
// Uses React Query to fetch and refresh user list on mutations.

const roles: Role[] = ['ADMIN', 'DOCTOR', 'PATIENT']

export default function UsersPage() {
    const qc = useQueryClient()
    const snack = useSnack()

    const q = useQuery({ queryKey: ['users'], queryFn: usersApi.list })

    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<UserResponseDto | null>(null)
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const [toDelete, setToDelete] = React.useState<UserResponseDto | null>(null)

    const [form, setForm] = React.useState<UpdateUserRequestDto>({
        role: 'PATIENT',
        status: 'ACTIVE',
        doctorId: null,
        patientId: null
    })

    const createMut = useMutation({
        mutationFn: (dto: UpdateUserRequestDto) => usersApi.create(dto),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['users'] })
            snack.show('User created', 'success')
        }
    })

    const updateMut = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateUserRequestDto }) => usersApi.update(id, dto),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['users'] })
            snack.show('User updated', 'success')
        }
    })

    const delMut = useMutation({
        mutationFn: (id: number) => usersApi.remove(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['users'] })
            snack.show('User deleted', 'success')
        }
    })

    const cols: GridColDef<UserResponseDto>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'role', headerName: 'Role', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'doctorId', headerName: 'DoctorId', width: 120 },
        { field: 'patientId', headerName: 'PatientId', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            sortable: false,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        onClick={() => {
                            setEditing(p.row)
                            setForm({
                                role: p.row.role,
                                status: p.row.status,
                                doctorId: p.row.doctorId ?? null,
                                patientId: p.row.patientId ?? null
                            })
                            setOpen(true)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => {
                            setToDelete(p.row)
                            setConfirmOpen(true)
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ]

    return (
        <>
            <Page
                title="Users"
                subtitle="Admin user management"
                actions={
                    <Button
                        variant="contained"
                        onClick={() => {
                            setEditing(null)
                            setForm({ role: 'PATIENT', status: 'ACTIVE', doctorId: null, patientId: null })
                            setOpen(true)
                        }}
                    >
                        Add User
                    </Button>
                }
            >
                <div style={{ height: 560, width: '100%' }}>
                    <DataGrid rows={q.data ?? []} columns={cols} loading={q.isLoading} getRowId={(r) => r.id as number} />
                </div>
            </Page>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
                    <TextField
                        select
                        label="Role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        {roles.map((r) => (
                            <MenuItem key={r} value={r}>
                                {r}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />

                    <TextField
                        label="Doctor ID (optional)"
                        value={form.doctorId ?? ''}
                        onChange={(e) => setForm({ ...form, doctorId: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                    <TextField
                        label="Patient ID (optional)"
                        value={form.patientId ?? ''}
                        onChange={(e) => setForm({ ...form, patientId: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!form.role || !form.status) {
                                snack.show('Role and Status are required', 'warning')
                                return
                            }
                            if (editing?.id != null) await updateMut.mutateAsync({ id: editing.id, dto: form })
                            else await createMut.mutateAsync(form)
                            setOpen(false)
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                danger
                title="Delete user?"
                message={`Delete user "${toDelete?.email}"?`}
                confirmText="Delete"
                onClose={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    if (!toDelete?.id) return
                    await delMut.mutateAsync(toDelete.id)
                }}
            />
        </>
    )
}