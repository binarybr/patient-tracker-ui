import React from 'react'
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { navItems } from './Nav'

const drawerWidth = 240

export function AppShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const nav = useNavigate()
    const { user, logout } = useAuth()

    const items = navItems.filter(i => user && i.roles.includes(user.role))

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Patient Tracker
                    </Typography>
                    {user && (
                        <>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                {user.email} ({user.role})
                            </Typography>
                            <Button color="inherit" onClick={() => { logout(); nav('/login') }}>Logout</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: drawerWidth }} role="presentation">
                    <List>
                        {items.map((i) => (
                            <ListItemButton key={i.to} onClick={() => { nav(i.to); setOpen(false) }}>
                                <ListItemText primary={i.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {children}
            </Box>
        </Box>
    )
}