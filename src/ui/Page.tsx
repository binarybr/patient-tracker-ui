import * as React from 'react'
import { Box, Paper, Typography } from '@mui/material'

// ============================================================================
// Page Header Component
// ============================================================================
// Consistent page layout with:
// - Title and optional subtitle
// - Action buttons area (right side of header)
// - Content area below header
// Used by all main page components for consistent styling

type Props = {
    title: string           // Page title (required)
    subtitle?: string       // Optional descriptive subtitle
    actions?: React.ReactNode // Action buttons or controls area
    children: React.ReactNode  // Page content
}

/**
 * Page Component
 * Provides standardized page layout with header and content area
 * - Top card: title, subtitle, and action buttons
 * - Bottom card: main page content
 */
export default function Page({ title, subtitle, actions, children }: Props) {
    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Header section with title and actions */}
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{title}</Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {/* Right-aligned action buttons */}
                {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
            </Paper>

            {/* Main content area */}
            <Paper sx={{ p: 2 }}>{children}</Paper>
        </Box>
    )
}