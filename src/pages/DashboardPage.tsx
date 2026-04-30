import { Paper, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthProvider'

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Welcome</Typography>
            <Typography>Logged in as: {user?.email}</Typography>
            <Typography>Role: {user?.role}</Typography>
            <Typography>Status: {user?.status}</Typography>
        </Paper>
    )
}