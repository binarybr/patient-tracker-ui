import React from 'react'
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const { login } = useAuth()
    const nav = useNavigate()
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [err, setErr] = React.useState('')

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>

                <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    {err && <Typography color="error">{err}</Typography>}

                    <Button variant="contained" onClick={async () => {
                        setErr('')
                        try {
                            await login(email, password)
                            nav('/')
                        } catch {
                            setErr('Login failed')
                        }
                    }}>
                        Sign In
                    </Button>

                    <Button onClick={() => nav('/register')}>Create account</Button>
                </Box>
            </Paper>
        </Container>
    )
}