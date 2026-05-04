import { Paper, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthProvider'

// ============================================================================
// Dashboard Page
// ============================================================================
// Minimal landing page that shows current user profile information.
// This page is rendered after login and helps users confirm their role.

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