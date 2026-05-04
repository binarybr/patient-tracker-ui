import React from 'react'
import { Box, Button, Container, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'
import type { Role } from '../types/api'

// ============================================================================
// Registration Page
// ============================================================================
// New account registration page for PATIENT and DOCTOR roles.
// Admin registration is not exposed through this public form.

export default function RegisterPage() {
    const { register } = useAuth()
    const nav = useNavigate()
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [role, setRole] = React.useState<Role>('PATIENT')
    const [err, setErr] = React.useState('')

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Register</Typography>

                <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password (min 8)"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <TextField
                        select
                        label="Role"
                        value={role}
                        onChange={e => setRole(e.target.value as Role)}
                    >
                        <MenuItem value="PATIENT">PATIENT</MenuItem>
                        <MenuItem value="DOCTOR">DOCTOR</MenuItem>
                    </TextField>

                    {/* Error feedback shown when registration fails */}
                    {err && <Typography color="error">{err}</Typography>}

                    <Button
                        variant="contained"
                        onClick={async () => {
                            setErr('')
                            try {
                                await register(email, password, role)
                                nav('/')
                            } catch {
                                setErr('Registration failed')
                            }
                        }}
                    >
                        Create Account
                    </Button>

                    <Button onClick={() => nav('/login')}>Back to login</Button>
                </Box>
            </Paper>
        </Container>
    )
}