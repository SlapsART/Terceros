import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconX } from '@tabler/icons-react';

interface SalirSinGuardarDialogProps {
  open: boolean;
  onClose: () => void;
  onSalir: () => void;
  onGuardar: () => void;
}

export function SalirSinGuardarDialog({
  open,
  onClose,
  onSalir,
  onGuardar,
}: SalirSinGuardarDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" component="span">
          Tienes cambios sin guardar
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
        >
          <IconX size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Si sales ahora, los datos ingresados se perderán.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="text" size="small" onClick={onSalir}>
          Salir sin guardar
        </Button>
        <Button variant="contained" size="small" disableElevation onClick={onGuardar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
