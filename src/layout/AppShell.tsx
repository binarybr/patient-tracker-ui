import React from 'react'
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { navItems } from './Nav'

// ============================================================================
// AppShell Layout Component
// ============================================================================
// Provides the main layout structure for authenticated pages:
// - Fixed header with app title and user info
// - Responsive navigation drawer
// - Main content area
// Wraps all protected routes with consistent layout

const drawerWidth = 240 // Width of side navigation drawer

/**
 * AppShell Component
 * - Displays fixed app bar with branding and user menu
 * - Renders responsive navigation drawer
 * - Filters navigation items based on user role
 * - Manages drawer open/close state
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const nav = useNavigate()
    const { user, logout } = useAuth()

    // Filter navigation items to show only those accessible to current user's role
    const items = navItems.filter(i => user && i.roles.includes(user.role))

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Fixed header/app bar */}
            <AppBar position="fixed">
                <Toolbar>
                    {/* Menu icon to toggle drawer on mobile */}
                    <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    
                    {/* App title */}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Patient Tracker
                    </Typography>
                    
                    {/* User info and logout button */}
                    {user && (
                        <>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                {user.email} ({user.role})
                            </Typography>
                            <Button 
                                color="inherit" 
                                onClick={() => { logout(); nav('/login') }}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Responsive side navigation drawer */}
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: drawerWidth }} role="presentation">
                    <List>
                        {/* Render role-filtered navigation items */}
                        {items.map((i) => (
                            <ListItemButton 
                                key={i.to} 
                                onClick={() => { 
                                    nav(i.to)
                                    setOpen(false) // Close drawer after navigation
                                }}
                            >
                                <ListItemText primary={i.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main content area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {children}
            </Box>
        </Box>
    )
}