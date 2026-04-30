import * as React from 'react'
import { Alert, Snackbar } from '@mui/material'

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

export function SnackProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<SnackState>({
        open: false,
        message: '',
        kind: 'info'
    })

    const api = React.useMemo<SnackApi>(
        () => ({
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