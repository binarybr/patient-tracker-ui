import * as React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Switch, TextField, Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '../ui/Page'
import { useSnack } from '../ui/Snack'
import { doctorAvailabilityApi } from '../api/doctorAvailability'
import type { DayOfWeek, DoctorAvailability } from '../types/api'

const days: DayOfWeek[] = [
  'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'
]

const normTime = (t: string) => (t?.length === 5 ? t : (t || '').slice(0, 5))

export default function DoctorAvailabilityPage() {
  const qc = useQueryClient()
  const snack = useSnack()

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    dayOfWeek: 'MONDAY' as DayOfWeek,
    startTime: '09:00',
    endTime: '17:00',
    active: true
  })

  const q = useQuery({
    queryKey: ['doctorAvailability', 'my'],
    queryFn: doctorAvailabilityApi.my,
    retry: false
  })

  const createMut = useMutation({
    mutationFn: doctorAvailabilityApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['doctorAvailability', 'my'] })
      snack.show('Availability saved', 'success')
    },
    onError: (err: any) => {
      const msg = err?.response?.data || 'Failed to save availability'
      snack.show(String(msg), 'error')
    }
  })

  if (q.isError) {
    const msg = (q.error as any)?.response?.data || 'Failed to load availability'
    return (
      <Page title="Doctor Availability" subtitle="Manage your weekly clinic availability">
        <Alert severity="error">{String(msg)}</Alert>
      </Page>
    )
  }

  const cols: GridColDef<DoctorAvailability>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'dayOfWeek', headerName: 'Day', width: 140 },
    { field: 'startTime', headerName: 'Start', width: 140, valueFormatter: (v: any) => String(v.value ?? '').slice(0, 5) },
    { field: 'endTime', headerName: 'End', width: 140, valueFormatter: (v: any) => String(v.value ?? '').slice(0, 5) },
    { field: 'active', headerName: 'Active', width: 120, type: 'boolean' }
  ]

  return (
    <>
      <Page
        title="Doctor Availability"
        subtitle="Manage your weekly clinic availability"
        actions={
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Availability
          </Button>
        }
      >
        <div style={{ height: 560, width: '100%' }}>
          <DataGrid
            rows={q.data ?? []}
            columns={cols}
            loading={q.isLoading}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
          />
        </div>
      </Page>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Availability</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
          <TextField
            select
            label="Day"
            value={form.dayOfWeek}
            onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })}
          >
            {days.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Start Time"
            type="time"
            value={normTime(form.startTime)}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="End Time"
            type="time"
            value={normTime(form.endTime)}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!form.startTime || !form.endTime) {
                snack.show('Start and End time are required', 'warning')
                return
              }
              if (normTime(form.startTime) >= normTime(form.endTime)) {
                snack.show('Start time must be before End time', 'warning')
                return
              }
              await createMut.mutateAsync({
                ...form,
                startTime: normTime(form.startTime),
                endTime: normTime(form.endTime)
              })
              setOpen(false)
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
``