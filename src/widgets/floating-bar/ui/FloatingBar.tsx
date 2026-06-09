import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface FloatingBarProps {
  onInactivar?: () => void;
  onDescartar?: () => void;
  onGuardar: () => void;
  guardarLabel?: string;
  showInactivar?: boolean;
  guardarDisabled?: boolean;
}

export function FloatingBar({
  onInactivar,
  onDescartar,
  onGuardar,
  guardarLabel = 'Crear tercero',
  showInactivar = true,
  guardarDisabled = false,
}: FloatingBarProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 12,
        left: '50%',
        zIndex: 1200,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        minWidth: 400,
        animation: 'floatBarIn 0.32s cubic-bezier(0.16,1,0.3,1) both',
        '@keyframes floatBarIn': {
          from: { opacity: 0, transform: 'translateX(-50%) translateY(14px)' },
          to:   { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
        },
      }}
    >
      {showInactivar && onInactivar && (
        <>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
            onClick={onInactivar}
          >
            Inactivar
          </Typography>
          <Box sx={{ flex: 1 }} />
        </>
      )}

      {!showInactivar && <Box sx={{ flex: 1 }} />}

      <Box sx={{ display: 'flex', gap: 1 }}>
        {onDescartar && (
          <Button variant="text" size="medium" onClick={onDescartar}>
            Descartar
          </Button>
        )}
        <Button variant="contained" size="medium" onClick={onGuardar} disabled={guardarDisabled}>
          {guardarLabel}
        </Button>
      </Box>
    </Box>
  );
}
