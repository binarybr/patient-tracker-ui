import * as React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'

type Props = {
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
    onConfirm: () => void | Promise<void>
    onClose: () => void
}

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
                <Button onClick={onClose} disabled={busy}>
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    color={danger ? 'error' : 'primary'}
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