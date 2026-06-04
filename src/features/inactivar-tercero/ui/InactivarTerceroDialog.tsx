import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { IconX } from '@tabler/icons-react';

interface InactivarTerceroDialogProps {
  open: boolean;
  nombre: string;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

export function InactivarTerceroDialog({
  open,
  nombre,
  onClose,
  onConfirm,
}: InactivarTerceroDialogProps) {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(motivo);
    setMotivo('');
  };

  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" component="span">
          Inactivar &ldquo;{nombre}&rdquo;
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
        >
          <IconX size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Al confirmar, el tercero no se podrá utilizar a futuro, pero, se guardará el registro de
          los usos anteriores.
        </Typography>
        <TextField
          label="Motivo"
          size="small"
          fullWidth
          multiline
          minRows={2}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button variant="text" size="small" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" size="small" disableElevation onClick={handleConfirm}>
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
