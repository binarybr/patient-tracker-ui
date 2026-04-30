import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '../ui/Page'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useSnack } from '../ui/Snack'
import { casesApi } from '../api/cases'
import { patientsApi } from '../api/patients'
import { doctorsApi } from '../api/doctors'
import type { CaseDto, MedicalCase } from '../types/api'
import CaseHistoryDialog from '../ui/CaseHistoryDialog'


export default function CasesPage() {
    const qc = useQueryClient()
    const snack = useSnack()

    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<MedicalCase | null>(null)
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const [toDelete, setToDelete] = React.useState<MedicalCase | null>(null)

    const casesQ = useQuery({ queryKey: ['cases'], queryFn: casesApi.list })
    const patsQ = useQuery({ queryKey: ['patients'], queryFn: patientsApi.list })
    const docsQ = useQuery({ queryKey: ['doctors'], queryFn: doctorsApi.list })

    const [historyCaseId, setHistoryCaseId] = React.useState<number | null>(null)

    const [form, setForm] = React.useState<CaseDto>({
        patientId: 0,
        doctorId: 0,
        title: '',
        diagnosis: '',
        symptoms: '',
        medicines: ''
    })

    const createMut = useMutation({
        mutationFn: (dto: CaseDto) => casesApi.create(dto),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['cases'] })
            snack.show('Case created', 'success')
        }
    })

    const updateMut = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: Partial<CaseDto> }) => casesApi.update(id, dto),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['cases'] })
            snack.show('Case updated', 'success')
        }
    })

    const delMut = useMutation({
        mutationFn: (id: number) => casesApi.remove(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['cases'] })
            snack.show('Case deleted', 'success')
        }
    })

    const cols: GridColDef<MedicalCase>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'title', headerName: 'Title', flex: 1, valueGetter: (_, row: MedicalCase) => row.title ?? '' },
        { field: 'patient', headerName: 'Patient', flex: 1, valueGetter: (_, row: MedicalCase) => row.patient?.name },
        { field: 'doctor', headerName: 'Doctor', flex: 1, valueGetter: (_, row: MedicalCase) => row.doctor?.name },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            sortable: false,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        onClick={() => {
                            setEditing(p.row)
                            setForm({
                                patientId: p.row.patient?.id ?? 0,
                                doctorId: p.row.doctor?.id ?? 0,
                                title: p.row.title ?? '',
                                diagnosis: p.row.diagnosis ?? '',
                                symptoms: p.row.symptoms ?? '',
                                medicines: p.row.medicines ?? ''
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

    const patients = patsQ.data ?? []
    const doctors = docsQ.data ?? []

    return (
        <>
            <Page
                title="Cases"
                subtitle="Medical cases opened for patients with doctors"
                actions={
                    <Button
                        variant="contained"
                        onClick={() => {
                            setEditing(null)
                            setForm({ patientId: 0, doctorId: 0, title: '', diagnosis: '', symptoms: '', medicines: '' })
                            setOpen(true)
                        }}
                    >
                        Add Case
                    </Button>
                }
            >
                <div style={{ height: 560, width: '100%' }}>
                    <DataGrid
                        rows={casesQ.data ?? []}
                        columns={cols}
                        loading={casesQ.isLoading}
                        getRowId={(r) => r.id}
                        disableRowSelectionOnClick
                    />
                </div>
            </Page>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editing ? 'Edit Case' : 'Create Case'}</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
                    <TextField
                        select
                        label="Patient"
                        value={form.patientId || ''}
                        onChange={(e) => setForm({ ...form, patientId: Number(e.target.value) })}
                    >
                        {patients.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name} (#{p.id})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Doctor"
                        value={form.doctorId || ''}
                        onChange={(e) => setForm({ ...form, doctorId: Number(e.target.value) })}
                    >
                        {doctors.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.name} (#{d.id})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Title" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <TextField
                        label="Diagnosis"
                        multiline
                        minRows={3}
                        value={form.diagnosis ?? ''}
                        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                    />
                    <TextField
                        label="Symptoms"
                        multiline
                        minRows={3}
                        value={form.symptoms ?? ''}
                        onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    />
                    <TextField
                        label="Medicines"
                        multiline
                        minRows={3}
                        value={form.medicines ?? ''}
                        onChange={(e) => setForm({ ...form, medicines: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!form.patientId || !form.doctorId) {
                                snack.show('Patient and Doctor are required', 'warning')
                                return
                            }
                            if (editing) await updateMut.mutateAsync({ id: editing.id, dto: form })
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
                title="Delete case?"
                message={`Delete case #${toDelete?.id} (${toDelete?.title ?? 'Untitled'})?`}
                confirmText="Delete"
                onClose={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    if (!toDelete) return
                    await delMut.mutateAsync(toDelete.id)
                }}
            />

            <CaseHistoryDialog
                open={historyCaseId != null}
                caseId={historyCaseId}
                onClose={() => setHistoryCaseId(null)}
            />
        </>
    )
}