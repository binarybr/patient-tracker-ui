import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'

type Props = {
    open: boolean
    entityLabel: string
    onClose: () => void
    onConfirm: () => Promise<void> | void
}

export default function HardDeleteDialog({ open, entityLabel, onClose, onConfirm }: Props) {
    const [text, setText] = React.useState('')

    React.useEffect(() => {
        if (open) setText('')
    }, [open])

    const canDelete = text.trim().toUpperCase() === 'DELETE'

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Permanent Delete</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
                <Typography variant="body2" color="error">
                    This will permanently delete <b>{entityLabel}</b>. This action cannot be undone.
                </Typography>

                <Typography variant="body2">
                    Type <b>DELETE</b> to confirm.
                </Typography>

                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type DELETE"
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={!canDelete}
                    onClick={async () => {
                        await onConfirm()
                        onClose()
                    }}
                >
                    Delete Permanently
                </Button>
            </DialogActions>
        </Dialog>
    )
}