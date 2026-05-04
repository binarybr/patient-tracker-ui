import * as React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'

// ============================================================================
// Confirmation Dialog Component
// ============================================================================
// Reusable modal dialog for user confirmations:
// - Custom title and message
// - Customizable button labels
// - Danger (destructive) vs normal actions
// - Async confirmation handling with loading state

type Props = {
    open: boolean                                    // Whether dialog is visible
    title?: string                                   // Dialog title
    message?: string                                 // Confirmation message
    confirmText?: string                             // Confirm button label
    cancelText?: string                              // Cancel button label
    danger?: boolean                                 // If true, confirm button is red (error color)
    onConfirm: () => void | Promise<void>           // Called when user clicks confirm
    onClose: () => void                              // Called when dialog should close
}

/**
 * ConfirmDialog Component
 * - Handles async confirmation with loading state
 * - Disables buttons during async operation
 * - Supports both sync and async confirm handlers
 * - Optional "danger" mode for destructive actions (delete, etc)
 */
export default function ConfirmDialog({
    open,
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    onConfirm,
    onClose
}: Props) {
    const [busy, setBusy] = React.useState(false)

    return (
        <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {/* Cancel button - closes dialog without action */}
                <Button onClick={onClose} disabled={busy}>
                    {cancelText}
                </Button>
                
                {/* Confirm button - triggers onConfirm callback */}
                <Button
                    variant="contained"
                    color={danger ? 'error' : 'primary'}  // Red for dangerous/destructive actions
                    disabled={busy}
                    onClick={async () => {
                        try {
                            setBusy(true)
                            await onConfirm()
                            onClose()
                        } finally {
                            setBusy(false)
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}