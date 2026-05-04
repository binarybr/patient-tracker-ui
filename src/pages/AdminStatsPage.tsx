import { Box, Paper, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Page from '../ui/Page'
import { adminApi } from '../api/admin'

// ============================================================================
// Admin Statistics Page
// ============================================================================
// Admin dashboard widget showing system counts for users, doctors, and patients.

export default function AdminStatsPage() {
    const q = useQuery({
        queryKey: ['adminStats'],
        queryFn: adminApi.stats,
        retry: false
    })

    const stats = q.data

    return (
        <Page title="Admin Stats" subtitle="Quick snapshot of system counts">
            <Box sx={{ display: 'grid', gap: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Users</Typography>
                    <Typography>{stats?.users ?? (q.isLoading ? 'Loading...' : '-')}</Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Doctors</Typography>
                    <Typography>{stats?.doctors ?? (q.isLoading ? 'Loading...' : '-')}</Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Patients</Typography>
                    <Typography>{stats?.patients ?? (q.isLoading ? 'Loading...' : '-')}</Typography>
                </Paper>
            </Box>
        </Page>
    )
}