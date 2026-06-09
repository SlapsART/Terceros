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
import Zoom from '@mui/material/Zoom';
import { IconX } from '@tabler/icons-react';

interface ForzarCreacionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmar: (justificacion: string) => void;
}

export function ForzarCreacionDialog({ open, onClose, onConfirmar }: ForzarCreacionDialogProps) {
  const [justificacion, setJustificacion] = useState('');

  const handleClose = () => {
    setJustificacion('');
    onClose();
  };

  const handleConfirmar = () => {
    onConfirmar(justificacion);
    setJustificacion('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={200}
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" component="span">
          Crear tercero
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
          Vas a registrar un tercero con riesgo de duplicidad, para continuar debes ingresar una
          justificación.
        </Typography>
        <TextField
          label="Justificación"
          required
          fullWidth
          multiline
          minRows={2}
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button variant="text" size="small" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
            disableElevation
            disabled={!justificacion.trim()}
            onClick={handleConfirmar}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
