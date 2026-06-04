import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InactivoPopoverProps {
  anchorEl: HTMLElement | null;
  motivo?: string;
  onClose: () => void;
}

export function InactivoPopover({ anchorEl, motivo, onClose }: InactivoPopoverProps) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            p: 1.5,
            maxWidth: 280,
            borderRadius: 1,
            boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      {motivo ? (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Motivo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {motivo}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Sin dirección registrada agrega una para activar el tercero.
        </Typography>
      )}
    </Popover>
  );
}
