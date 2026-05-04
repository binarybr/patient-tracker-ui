import * as React from 'react'
import { Alert, Snackbar } from '@mui/material'

// ============================================================================
// Toast Notification System (Snackbar Provider)
// ============================================================================
// Provides global notification/toast messages:
// - Success messages: confirms successful operations
// - Error messages: shows error states
// - Warning messages: alerts about potential issues
// - Info messages: general informational messages
// Auto-hides after 3.5 seconds

type SnackKind = 'success' | 'error' | 'info' | 'warning'

type SnackState = {
    open: boolean
    message: string
    kind: SnackKind
}

type SnackApi = {
    show: (message: string, kind?: SnackKind) => void
}

const SnackCtx = React.createContext<SnackApi | null>(null)

/**
 * SnackProvider Component
 * - Wraps app to provide global notification system
 * - Displays single toast at bottom center of screen
 * - Auto-dismisses after 3.5 seconds
 */
export function SnackProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<SnackState>({
        open: false,
        message: '',
        kind: 'info'
    })

    const api = React.useMemo<SnackApi>(
        () => ({
            // Show notification with optional severity level
            show: (message, kind = 'info') => setState({ open: true, message, kind })
        }),
        []
    )

    return (
        <SnackCtx.Provider value={api}>
            {children}
            <Snackbar
                open={state.open}
                autoHideDuration={3500}
                onClose={() => setState((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={state.kind}
                    variant="filled"
                    onClose={() => setState((s) => ({ ...s, open: false }))}
                    sx={{ width: '100%' }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </SnackCtx.Provider>
    )
}

export function useSnack() {
    const ctx = React.useContext(SnackCtx)
    if (!ctx) throw new Error('SnackProvider is missing')
    return ctx
}