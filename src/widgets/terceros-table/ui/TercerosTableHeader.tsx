import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fadeIn } from '@/shared/ui/animations';

export function TercerosTableHeader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 0.5,
        bgcolor: 'grey.100',
        ...fadeIn,
        animationDelay: '80ms',
      }}
    >
      {/* Icon column placeholder — matches row icon width */}
      <Box sx={{ width: 22, height: 16, flexShrink: 0 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          Nombre
        </Typography>
      </Box>

      <Box sx={{ width: 320, flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary">
          Rol
        </Typography>
      </Box>

      <Box sx={{ width: 160, flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary">
          Tipo
        </Typography>
      </Box>

      <Box sx={{ width: 160, flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary">
          Estado
        </Typography>
      </Box>

      {/* Chevron column placeholder */}
      <Box sx={{ width: 22, flexShrink: 0 }} />
    </Box>
  );
}
