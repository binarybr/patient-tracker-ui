import { Dialog, DialogContent, DialogTitle, Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { casesApi } from '../api/cases'
import type { MedicalCaseVersion } from '../types/api'

type Props = {
    open: boolean
    caseId: number | null
    onClose: () => void
}

export default function CaseHistoryDialog({ open, caseId, onClose }: Props) {
    const q = useQuery({
        queryKey: ['caseVersions', caseId],
        queryFn: () => casesApi.versions(caseId as number),
        enabled: open && !!caseId,
        retry: false
    })

    const cols: GridColDef<MedicalCaseVersion>[] = [
        { field: 'version', headerName: 'Version', width: 110 },
        { field: 'createdAt', headerName: 'Created At', width: 200 },
        { field: 'diagnosis', headerName: 'Diagnosis', flex: 1 },
        { field: 'symptoms', headerName: 'Symptoms', flex: 1 },
        { field: 'medicines', headerName: 'Medicines', flex: 1 }
    ]

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Case History (Versions)</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {q.isError && (
                    <Alert severity="error">Failed to load case history.</Alert>
                )}

                <div style={{ height: 520, width: '100%' }}>
                    <DataGrid
                        rows={q.data ?? []}
                        columns={cols}
                        loading={q.isLoading}
                        getRowId={(r) => r.id}
                        disableRowSelectionOnClick
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}