import * as React from 'react'
import { Box, Paper, Typography } from '@mui/material'

type Props = {
    title: string
    subtitle?: string
    actions?: React.ReactNode
    children: React.ReactNode
}

export default function Page({ title, subtitle, actions, children }: Props) {
    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{title}</Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
            </Paper>

            <Paper sx={{ p: 2 }}>{children}</Paper>
        </Box>
    )
}